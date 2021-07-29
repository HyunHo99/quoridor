
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from "./components/views/RegisterPage/RegisterPage"
import GamePage from "./components/views/GamePage/GamePage"
import GameRoom from "./components/views/GamePage/GameRoom"
import WinPage from "./components/views/ResultPage/WinPage"
import LosePage from "./components/views/ResultPage/LosePage"
import Auth from "./hoc/auth"
import React from "react";

function App(props) {
  return (
    <Router>
    <div>

      <hr />

      {/*
        A <Switch> looks through all its children <Route>
        elements and renders the first one whose path
        matches the current URL. Use a <Switch> any time
        you have multiple routes, but you want only one
        of them to render at a time
      */}
      <Switch>
        <Route exact path="/" component={Auth(LandingPage, null, props)}/>
        <Route exact path="/login" component={Auth(LoginPage, false, props)}/>
        <Route exact path="/register" component={Auth(RegisterPage, false, props)}/>
        <Route exact path="/game" component={Auth(GamePage, true, props)}/>
        <Route exact path="/gameRoom" component={Auth(GameRoom, true, props)}/>
        <Route exact path="/resultPage_win" component={Auth(WinPage, true, props)}/>
        <Route exact path="/resultPage_lose" component={Auth(LosePage, true, props)}/>
      </Switch>
    </div>
  </Router>
  );
}


export default App;
