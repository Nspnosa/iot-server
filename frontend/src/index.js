import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import UserLogin from './components/UserLogin';
import UserSignup from './components/UserSignup';
import Recovery from './components/Recovery';
import NavBar from './components/NavBar';
import Message from './components/Message';
import Dashboard from './components/Dashboard';
import ResetAccount from './components/ResetAccount';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './index.css';

const rootElement = document.getElementById('root');

function App() {
  const [userLogged, setUserLogged] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('iot-server-token');
      if (!token) {
        setUserLogged(false);
        return;
      }
      try {
        const result = await fetch('/api/verify', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((data) => {
            return Promise.all([data.json(), data.status]);
          })
          .then(([data, status]) => {
            if (status !== 200) {
              localStorage.removeItem('iot-server-token');
            }
            return status === 200;
          });
        setUserLogged(result);
      } catch (err) {
        setUserLogged(false);
      }
    }
    fetchData();
  }, []);

  //determine if data is saved locally

  if (userLogged === null) {
    return <div></div>;
  }

  return (
    <Router>
      <NavBar
        userLogged={userLogged}
        setUserLogged={(logged) => setUserLogged(logged)}
      />
      <div className="app-container">
        <Switch>
          <Route
            path="/"
            exact
            component={() =>
              userLogged ? (
                <Dashboard />
              ) : (
                <Message messages={['Welcome', 'iot server']} />
              )
            }
          />
          <Route
            path="/login"
            exact
            component={() => (
              <UserLogin
                setUserLogged={(logged) => setUserLogged(logged)}
                userLogged={userLogged}
              />
            )}
          />
          <Route
            path="/signup"
            exact
            component={() => <UserSignup userLogged={userLogged} />}
          />
          <Route
            path="/recovery"
            exact
            component={() => <Recovery userLogged={userLogged} />}
          />
          <Route
            path="/resetaccount/:token"
            exact
            component={() => <ResetAccount userLogged={userLogged} />}
          />
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, rootElement);
