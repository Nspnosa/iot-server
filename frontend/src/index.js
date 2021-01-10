import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import UserLogin from './components/UserLogin';
import UserSignup from './components/UserSignup';

import { useSpring, animated } from 'react-spring';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './index.css';

const rootElement = document.getElementById('root');

function App() {
  const [userLogged, setUserLogged] = useState(() => {
    const token = localStorage.getItem('iot-server-token');
    if (!token) {
      console.log('no token');
      return false;
    }

    let verificationStatus;

    fetch('/api/verify', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).then((data) => {
      verificationStatus = data.status === 200;
    });

    if (!verificationStatus) {
      localStorage.removeItem('iot-server-token');
      console.log('invalid token');
    }
    return verificationStatus;
  });

  //determine if data is saved locally

  return (
    <Router>
      <div className="app-container">
        <Switch>
          <Route path="/login" exact component={UserLogin} />
          <Route path="/signup" component={UserSignup} />
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, rootElement);
