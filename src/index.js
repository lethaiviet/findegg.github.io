import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import DashBoard from "layouts/DashBoard/dashBoard";
import GameFindEgg from "layouts/GameFindEgg/gameFindEgg";
import "assets/css/material-dashboard-react.css?v=1.9.0";

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/findegg.github.io/dashboard" component={DashBoard} />
      <Route path="/findegg.github.io/game-find-egg" component={GameFindEgg} />
      <Redirect from="/" to="/findegg.github.io/dashboard" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
