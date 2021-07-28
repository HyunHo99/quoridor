
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
import LoosePage from "./components/views/ResultPage/LoosePage"
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
        <Route exact path="/" component={Auth(LandingPage, null)}/>
        <Route exact path="/login" component={Auth(LoginPage, false)}/>
        <Route exact path="/register" component={Auth(RegisterPage, false)}/>
        <Route exact path="/game" component={Auth(GamePage, null)}/>
        <Route exact path="/gameRoom" component={Auth(GameRoom, null)}/>
        <Route exact path="/resultPage_win" component={Auth(WinPage, null)}/>
        <Route exact path="/resultPage_loose" component={Auth(LoosePage, null)}/>
      </Switch>
    </div>
  </Router>
  );
}


export default App;
