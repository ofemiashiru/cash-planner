//Using PostGresSQL from db.js file
const pool = (require(__dirname + "/db.js"));

//For handling sessions and cookies
module.exports.passport = require("passport");
module.exports.session = require("express-session");
module.exports.LocalStrategy = require("passport-local").Strategy;

const LocalStrategy = require("passport-local").Strategy;

//For Encrypting passwords
bcrypt = require("bcryptjs");
module.exports.salt = bcrypt.genSaltSync(10); //Salt auto generates random characters to be added to the hashed password

module.exports.initialize = function (passport) {
  const authenticateUser = (username, password, done) =>{
    pool.query(`SELECT * FROM users WHERE email = $1`,[username], (err, results)=>{
      if (err){
        console.log(err.message);
      } else {
        if(results.rows.length > 0){
          const user = results.rows[0]
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err.message);
            } else {
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, loginMessage = "Password is incorrect");
              }
            }
          });
        } else {
          return done(null, false, loginMessage = "User is not registered");
        }
      }
    });
  }

  passport.use(
    new LocalStrategy(
      {
        username: "username",
        password: "password"
      },
      authenticateUser
    )
  );

  passport.serializeUser((user, done)=> done(null, user.id));

  passport.deserializeUser((id, done)=> {
    pool.query(`SELECT * FROM users where id = $1`, [id], (err, results)=>{
      if(err){
        console.log(err.message);
      }
      return done(null, results.rows[0]);
    })
  })
}



///checkIsAuthenticated function
module.exports.checkIsAuthenticated = (req, res, next)=>{
  if(req.isAuthenticated()){
    return res.redirect("/dashboard");
  }
  next();
}

//checkNotAuthenticated function
module.exports.checkNotAuthenticated = (req, res, next) =>{
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/login")
  }
}
