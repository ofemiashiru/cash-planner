import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserXmark, faUser, faEllipsisVertical, faLockOpen, faLock} from '@fortawesome/free-solid-svg-icons'

function SideBar(props){

  const endSession = async () => {
    fetch('/api/logout', {
      method: 'POST',
    })
    // window.location.reload(false);
    window.location.replace("/login");
  }

  const sideEmail = typeof props.email.userDetails === "undefined"?"":props.email.userDetails.username

  return (
    <>
      <div className="sidebarMenu">
        <ul className="sidebarMenuInner">
          <li>
            {props.isLoggedIn?null:
              <>
                <span className="account-title"><FontAwesomeIcon icon={faEllipsisVertical} /> Cash Planner Menu</span>
                <span className="small-account-title"><FontAwesomeIcon icon={faEllipsisVertical} /> CP</span>

              </>
            }
            {props.isLoggedIn?<Link to="/dashboard"> <FontAwesomeIcon icon={faUser} title="Dashboard" /><span className="account-name"> <FontAwesomeIcon icon={faUser} /> {sideEmail}</span></Link>:null}
          </li>
          {props.isLoggedIn?null:<li><Link to="/login" ><FontAwesomeIcon icon={faLock} title="Home" /> <span>Login in to see menu</span></Link></li>}
          {/*<li><Link to="/about"><FontAwesomeIcon icon={faCircleInfo} title="About"/> <span>About</span></Link></li>*/}
          {props.isLoggedIn?<li><Link to="/delete-account"><FontAwesomeIcon icon={faUserXmark} title="Delete Account" /> <span>Delete Account</span></Link></li>:null}
          {props.isLoggedIn?<li><Link onClick={endSession} to="/login"><FontAwesomeIcon icon={faLockOpen} title="Log Out" /> <span>Log Out</span></Link></li>:null}
        </ul>
      </div>
    </>
  )
}

export default SideBar;
