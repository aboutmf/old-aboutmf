import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';

import { Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import RootComponent from "./components/root.component";

if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;

  setAuthToken(token);

  const decoded = jwt_decode(token);

  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
  
    window.location.href = "/login";
  }
}

class App extends Component {

  componentDidMount() {
    let path = localStorage.getItem('path');
    let has = localStorage.getItem('has');
    alert(has);

    if(!has) {
      alert('tes lagi');
      // localStorage.setItem('has', true);

      // return (<Redirect to={path} />);
    } else {
      alert('what');
    }
  }

  render() {
    return (
      <Provider store={store}>
        <RootComponent />
      </Provider>
    );
  }
}


export default App;