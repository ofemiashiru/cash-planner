//jshint esversion:6
//Make sure you start this at the beginning of every project and use .gitignore too
require("dotenv").config(); // This is to protect our codes, api keys etc.

const express = require("express");
const path = require("path");

//Make the app use express
const app = express();

//Set port to default port based on project server or 4000
const port = process.env.PORT || 4000;

//Using PostGresSQL from db.js file
const pool = (require(path.join(__dirname,"/db.js")));

//process.env.NODE_ENV => production or undefined
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"/client/build")))
}

//Use urlencoded to get post request from forms
app.use(express.urlencoded({ extended: true }));

//Login Modules
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local');

//Using this as session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
  // cookie: {maxAge: 1200000} //regulates how long the session lasts for in Millisecond
}));

app.use(passport.authenticate('session'));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.email });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10); //Salt auto generates random characters to be added to the hashed password


let message; //Holds success messages

//Passport used to authenticate user
passport.use(new LocalStrategy(function verify(username, password, cb){
  pool.query(`SELECT * FROM users WHERE email = $1`, [username], (err, results)=>{
    if(err){
      console.log(err.message);
    } else {
      if(results.rows.length > 0){
        const user = results.rows[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.log(err.message);
          } else {
            if (isMatch) {
              return cb(null, user, message="");
            } else {
              return cb(null, false, message = "Password is incorrect...please try again!");
            }
          }
        })
      } else {
        return cb(null, false, message =  "User does not exist...try another email!");
      }
    }
  });
}));

///checkIsAuthenticated, checkNotAuthenticated functions
function checkIsAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect("/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/login")
  }
}



///////////////////////////REGISTER/////////////////////////////////////////////
app.route("/api/register")
  .get((req, res)=>{
    pool.query(`SELECT * FROM fiat_currency`, (err, results)=>{
      if(err){
        console.log(err.message)
      } else{
        res.json({
          allCurrency:results.rows
        })
      }
    })
  })
  .post((req, res)=>{
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    const checkNewPassword = req.body.checkPassword;
    const newFiat = req.body.chosenFiat;

    // Encrypting Password - Hashing and adding Salt
    const hashPassword = bcrypt.hashSync(newPassword, salt);

    pool.query(`SELECT * FROM users WHERE email = $1`, [newUsername], (err, results)=>{
      if(err){
        console.log(err.message);
      } else {
        if(results.rowCount > 0){
          message = "This user already exists...login here.";
          res.redirect("/login");
        } else {
          pool.query(`INSERT INTO users (email, password, currency) VALUES ($1, $2, $3) RETURNING id, password`, [newUsername, hashPassword, newFiat], (err,results)=>{
            if(err){
              console.log(err.message);
            } else {
              pool.query(`INSERT INTO monthly_income (income, user_id) VALUES ($1, $2) RETURNING user_id`, [0,results.rows[0].id], (err, results)=>{
                if(err){
                  console.log(err.message);
                } else {
                  pool.query(`INSERT INTO budget_list (item, amount, user_id) VALUES ($1, $2, $3)`,['First Item',0,results.rows[0].user_id], (err)=>{
                    if(err){
                      console.log(err.message);
                    } else {
                      message = "You have been succesfully registered, you can now log in.";
                      res.redirect("/login");
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  });
app.route("/register")
  .get(checkNotAuthenticated, (req,res)=>{
    res.redirect("/#/register")
  });


///////////////////////////LOGIN////////////////////////////////////////////////
app.route("/api/login")
  .get(checkIsAuthenticated, (req, res)=>{
    res.json({"message":message});
    message = "";
  })
  .post(passport.authenticate("local",
    {
      successRedirect: "/dashboard",
      failureRedirect: "/login"
    })
  )

app.route("/login")
  .get(checkIsAuthenticated, (req,res)=>{
    res.redirect("/#/login")
  });

///////////////////////////DASHBOARD////////////////////////////////////////////
app.route("/api/dashboard")
  .get(checkNotAuthenticated, (req, res)=>{
    const userDetails = req.user;

    pool.query(`SELECT * FROM budget_list WHERE user_id = $1`,[userDetails.id], (err, results)=>{
      if(err){
        console.log(err.message);
      } else {
        const budgetList = results.rows;

        pool.query(`SELECT * FROM monthly_income WHERE user_id = $1`,[userDetails.id],(err, results)=>{
          if(err){
            console.log(err.message);
          } else {
            const income = results.rows[0].income;

            pool.query(`SELECT sum(amount) AS monthlyspend FROM budget_list WHERE user_id = $1`, [userDetails.id],(err, results)=>{
              if(err){
                console.log(err.message);
              } else {
                const monthlySpend = results.rows[0].monthlyspend

                pool.query(`SELECT * FROM fiat_currency`,(err, results)=>{
                  if(err){
                    console.log(err.message);
                  } else{
                    const allFiatCurrency = results.rows;

                    pool.query(`SELECT currency FROM users WHERE id = $1`,[userDetails.id], (err,results)=>{
                      if(err){
                        console.log(err.message);
                      } else {
                        const currencyID = results.rows[0].currency;

                        pool.query(`SELECT * FROM fiat_currency WHERE id = $1`, [currencyID], (err,results)=>{
                          if(err){
                            console.log(err.message);
                          } else {
                            const userFiatCurrency = results.rows[0];

                            res.json({
                              income:income,
                              budget:budgetList,
                              monthlyspend:monthlySpend,
                              userDetails:userDetails,
                              id:userDetails.id,
                              username:userDetails.username,
                              currencyID:currencyID,
                              fiatLocale:userFiatCurrency.locale,
                              fiatOption:userFiatCurrency.option,
                              allFiatCurrency:allFiatCurrency
                            });

                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  })
  .post(checkNotAuthenticated, (req,res)=>{
    const userDetails = req.user;

    const newItem = req.body.item;
    const newItemAmount = req.body.itemAmount;

    if(newItem && newItemAmount){
      pool.query(`INSERT INTO budget_list (item, amount, user_id) VALUES ($1, $2, $3)`, [newItem, newItemAmount, userDetails.id], (err, results)=>{
        if(err){
          console.log(err.message)
            res.redirect("/dashboard");
        } else {
          res.redirect("/dashboard");
        }
      });
    }
  })

app.route("/dashboard")
  .get(checkNotAuthenticated, (req,res)=>{
    res.redirect("/#/dashboard")
  });


///////////////////////////UPDATE MONTHLY INCOME////////////////////////////////
app.route("/api/update-income")
  .post((req, res)=>{
    const userDetails = req.user;
    const newMonthlyIncome = req.body.monthlyIncome;

    pool.query(`UPDATE monthly_income SET income = $1 WHERE user_id = $2`, [newMonthlyIncome, userDetails.id], (err, results)=>{
      if(err){
        console.log(err.message);
      } else {
        res.redirect("/dashboard");
      }
    });
  })


///////////////////////////DELETE ITEM//////////////////////////////////////////
app.route("/api/delete-item")
  .post((req, res)=>{
    const itemID = req.body.item_id
    pool.query(`DELETE FROM budget_list WHERE id = $1`,[itemID], (err, result)=>{
      if(err){
        console.log(err.message);
      } else {
        res.redirect("/dashboard");
      }
    });
  })


///////////////////////////CHANGE CURRENCY//////////////////////////////////////
app.route("/api/change-currency")
  .post((req, res)=>{
    const newCurrency = req.body.currency_id;
    const userID = req.user.id;

    pool.query(`UPDATE users SET currency = $1 WHERE id = $2`,[newCurrency, userID], (err, results)=>{
      if(err){
        console.log(err.message)
      } else {
        res.redirect("/dashboard");
      }
    })
  })

///////////////////////////CONFIRM_DELETE_ACCOUNT///////////////////////////////
app.route("/api/confirm-delete")
  .post((req, res)=>{
    const userID = req.body.id
    pool.query(`DELETE FROM budget_list WHERE user_id = $1;`, [userID], (err,results)=>{
      if(err){
        console.log(err.message);
      } else {
        pool.query(`DELETE FROM monthly_income WHERE user_id = $1;`, [userID], (err, results)=>{
          if(err){
            console.log(err.message);
          } else {
            pool.query(`DELETE from users WHERE id = $1;`, [userID], (err, results)=>{
              if(err){
                console.log(err.message);
              } else {
                message = "Your account has been succesfully deleted."
                req.logOut();
                res.redirect("/login");
              }
            });
          }
        });
      }
    });
  });

///////////////////////////LOGOUT///////////////////////////////////////////////
app.route("/api/logout")
  .post((req, res)=>{
    message = "You have been succesfully logged out."
    req.logout();
    res.redirect('/login');
  })

///////////////////////////HANDLE ALL ROUTES////////////////////////////////////
app.route("*")
  .get((req, res)=>{
    res.redirect("/#/page-not-found")
  });
///////////////////////////PORT LISTEN//////////////////////////////////////////
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
