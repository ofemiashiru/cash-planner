import React, {useState, useEffect} from "react";

function Register(){
  const [backendData, setBackendData] = useState([{}]);
  const [inputs, setInputs] = useState({
    username:"",
    password:"",
    checkPassword:"",
    currency:1
  });


  useEffect(()=>{
    fetch("/api/register")
    .then(response => response.json())
    .then(data =>{setBackendData(data)})
  },[])

  const allCurrency = typeof backendData.allCurrency === "undefined"?[]:backendData.allCurrency;

  function handleInput(event){
    const {name, value} = event.target

    setInputs((prevInputs) => {

      return {
        ...prevInputs,
        [name]: value
      };
    });
  }

  return(
    <>
      <div className="main">
        <div className="left-side">
        </div>
        <div className="mainInner full-page">
          <h1>Register</h1>
          <form className="regForm" action="/api/register" method="POST">
            <div className="form-group">
              <input type="email" placeholder="Email" name="username" onChange={handleInput} />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" name="password" onChange={handleInput}  />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Re-Enter Password" name="checkPassword" onChange={handleInput} />
            </div>
            <div className="form-group">
              <label>Select default currency:</label>
              <select name="chosenFiat" onChange={handleInput} defaultValue={1}>
                {allCurrency.map(each => <option key={each.id} value={each.id}>{each.option}</option>)}
              </select>
            </div>
            <div className="form-group fg-button">

              <button type="submit"

                className={
                            !inputs.username?"link-buttons disable-link-buttons":
                            !inputs.password?"link-buttons disable-link-buttons":
                            inputs.password !== inputs.checkPassword?"link-buttons disable-link-buttons":
                            inputs.password.length<6?"link-buttons disable-link-buttons":"link-buttons"
                          }
                disabled={
                            !inputs.username?true:
                            !inputs.password?true:
                            inputs.password !== inputs.checkPassword?true:
                            inputs.password.length<6?true:false
                          }>
                          Register
              </button>
            </div>
            <div>
              <p>
                {
                  !inputs.username?"Input your email":
                  !inputs.password?"Input a password":
                  inputs.password !== inputs.checkPassword?"Passwords do not match":
                  inputs.password.length<6?"Password should be atleast 6 characters":"You can now register"
                }
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
