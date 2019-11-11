import React from "react";
import { Route, NavLink } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import ActionList from "./components/ActionList";

function App() {
  return (
    <div className="App">
      <h1>Project App</h1>
      <Route path="/actions">
        <NavLink to="/" className="home-link">
          <p>Home</p>
        </NavLink>
      </Route>
      <Route exact path="/" component={ProjectList} />
      <Route path="/actions/:id" render={props => <ActionList {...props} />} />
    </div>
  );
}

export default App;
