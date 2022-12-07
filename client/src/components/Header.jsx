import React from "react";

import { Link } from "react-router-dom";

function Header(props){

  const endSession = async () => {
    fetch('/api/logout', {
      method: 'POST',
    })
    // window.location.reload(false);
    window.location.replace("/login");
  }


  return(
    <>
      <div className="header"><Link to="/"><img className="logo" src="/images/CashPlanner.gif" alt="CP_Logo"/></Link></div>
      <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" />
      <h1 className="branding"><Link to="/">Cash Planner</Link></h1>
      <label htmlFor="openSidebarMenu" className="sidebarIconToggle">
        <div className="spinner diagonal part-1"></div>
        <div className="spinner horizontal"></div>
        <div className="spinner diagonal part-2"></div>
      </label>

        <ul className="top-links">
          {props.isLoggedIn?null:<li><Link className="link-buttons" to="./login">Login</Link></li>}
          {props.isLoggedIn?null:<li><Link className="link-buttons" to="/register">Register</Link></li>}
          {props.isLoggedIn?<li><Link onClick={endSession} to="/login" className="link-buttons">Log Out</Link></li>:null}
        </ul>

    </>
  )
}


export default Header;
