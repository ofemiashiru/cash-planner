import React, {useEffect, useState} from "react";

import { Link } from "react-router-dom";

function DeleteAccount(){

  const [backendData, setBackendData] = useState([{}]);

  useEffect(()=>{
    fetch("/api/dashboard")
    .then(response => response.json())
    .then(data =>{setBackendData(data)})
  },[])

  return (
    <>
      <div id='center' className="main">
        <div className="left-side-dac">

        </div>
        <div className="mainInner full-page">
          <h1>Delete Account</h1>
          <p className="dac-para">
            We are sorry to see you go. <br/>Are you sure you want to delete the account of "{backendData.username}"?
          </p>
          <form method="POST" action="/api/confirm-delete">
              <button className="link-buttons dac-yes" type="submit" name="id" value={backendData.id} to="/confirm-delete">Yes</button>
              <Link className="link-buttons" to="/dashboard">No</Link>
          </form>
        </div>
      </div>
    </>
  )
}

export default DeleteAccount;
