import React from 'react';
import { useHistory, Link } from 'react-router-dom';

function NavBar({ userLogged, setUserLogged, ...rest }) {
  const history = useHistory();
  return (
    <div className="navbar-container">
      <div>
        <Link className="navbar-component" to="/">
          Home
        </Link>
      </div>
      <div>
        {(() => {
          if (!userLogged) {
            return (
              <>
                <Link className="navbar-component" to="/login">
                  Login
                </Link>
                <Link className="navbar-component" to="/signup">
                  Signup
                </Link>
              </>
            );
          } else {
            //remove user from localstorage, setUserLogged & go to "/"
            return (
              <Link
                className="navbar-component"
                to="/logout"
                onClick={(event) => {
                  event.preventDefault();
                  localStorage.removeItem('iot-server-token');
                  setUserLogged(false);
                  history.push('/');
                }}
              >
                Logout
              </Link>
            );
          }
        })()}
      </div>
    </div>
  );
}

export default NavBar;
