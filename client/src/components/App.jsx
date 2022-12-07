import React, {useEffect, useState } from "react";

import Header from "./Header"
import SideBar from "./SideBar";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

import DeleteAccount from "./DeleteAccount";
import Footer from "./Footer";

import NotFound from "./NotFound";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {

  const [backendData, setBackendData] = useState([{}]);

  useEffect(()=>{
    fetch("/api/dashboard")
    .then(response => response.json())
    .then(data =>{setBackendData(data)})
  },[])

  const loggedIn = backendData.userDetails?true:false;

  return (
    <Router>
    {/*This means I can use the Router in the entire application.
      All components nested inside it can have access to the Router*/}
      <>
        <Header
          isLoggedIn = {loggedIn}
        />
        <SideBar
          isLoggedIn = {loggedIn}
          email = {backendData}
        />

        <Switch> {/*Allows a single component to show at any one time based on the path*/}

          <Route exact path="/"> {/*using exact means that it takes into account the whole path rather than the first match it finds*/}
            {loggedIn ? <Dashboard /> : <Login />}
          </Route> 

          {loggedIn?
          <Route exact path="/dashboard">
             <Dashboard/>
          </Route>
          :null
          }

          {loggedIn?
          <Route exact path="/delete-account">
            <DeleteAccount />
          </Route>
          :null
          }

          {loggedIn?
          null:
          <Route exact path="/register">
            <Register />
          </Route>
          }

          {loggedIn?
          null:
          <Route exact path="/login">
             <Login />
          </Route>
          }

          <Route exact path="/page-not-found">
            <NotFound />
          </Route>

        {/*<Route exact path="*">
             <NotFound/>
          </Route>*/}

        </Switch>
        <Footer />
      </>
    </Router>
  );
}

export default App;
