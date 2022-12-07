import React from "react";


function Footer(){

  const now = new Date();
  const year = now.getFullYear();

  return(
    <div className="footer">
      <p className="copyright">&#169; Cash Planner {year}. All rights reserved.</p>
      <p className="socials">

      </p>
    </div>
  )
}

export default Footer;
