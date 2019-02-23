import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './Home'
import Login from './Login'
import AuthenticatedComponent from './AuthenticatedComponent'
import Protected from './Protected'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/Login" component={Login}></Route>
          <Route path="/" exact component={Home} />
          <AuthenticatedComponent path="/" component={AuthenticatedComponent}>
           
          </AuthenticatedComponent>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
