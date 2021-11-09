import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Meeting from "./components/Meeting";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import NoMatch from "./components/NoMatch";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Call from "./components/Call";
import MeetingId from "./components/MeetingId";

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            {/* <Route path="/meeting" exact component={Home} />
            <Route path="/meeting/:url" component={Video} /> */}
            <Route exact path="/" component={HomePage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/musicx" component={() => <h1>Musicx</h1>} />
            <Route exact path="/call" component={Call} />
            <Route exact path="/meeting" component={Meeting} />
            <Route exact path="/meeting/:id" component={MeetingId} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
