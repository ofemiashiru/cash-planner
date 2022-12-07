import React, {useEffect, useState } from "react";


function Login(){
  const [backendData, setBackendData] = useState([{}]);

  useEffect(()=>{
    fetch("/api/login")
    .then(response => response.json())
    .then(data =>{setBackendData(data)})
  },[])


  const [inputs, setInputs] = useState({
    username:"",
    password:""
  })

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
          <h1>Login</h1>
          <form className="regForm" action="/api/login" method="POST">
            <div className="form-group">
              <input type="email" placeholder="Email" name="username" onChange={handleInput} required/>
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" name="password" onChange={handleInput} required/>
            </div>
            <div className="form-group fg-button">
              <button type="submit"
                className={
                            !inputs.username?"link-buttons disable-link-buttons":
                            !inputs.password?"link-buttons disable-link-buttons":
                            inputs.password.length < 6?"link-buttons disable-link-buttons":"link-buttons"
                          }
                disabled={
                            !inputs.username?true:
                            !inputs.password?true:
                            inputs.password.length < 6?true:false
                          }
              >Login</button>
            </div>

            <div>
            <p>
              {
                !inputs.username?"Input your email":
                !inputs.password?"Input a password":
                inputs.password.length < 6?"Password is less than 6 characters":"You can now log in"
              }
            </p>
            {(typeof backendData.message === "undefined"?
              <p>{null}</p>:
              <p>{backendData.message}</p>)}

            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
