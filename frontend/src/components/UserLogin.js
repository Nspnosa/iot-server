import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useHistory, Link } from 'react-router-dom';

function UserLogin({ userLogged, setUserLogged, ...rest }) {
  const history = useHistory();
  const [inputData, setInputData] = useState({
    email: '',
    password: '',
  });
  const [msg, setMsg] = useState('');

  const [remember, setRemember] = useState(true);
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  function handleInputChange(event) {
    setInputData({
      ...inputData,
      [event.currentTarget.id.split('-')[0]]: event.currentTarget.value,
    });
  }

  async function handleOnClick(event) {
    event.preventDefault();
    await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: inputData.email,
        password: inputData.password,
      }),
    })
      .then((data) => {
        return Promise.all([data.json(), data.status]);
      })
      .then(([data, status]) => {
        if (status === 200) {
          if (remember) {
            localStorage.setItem('iot-server-token', data.token);
          }
          setUserLogged(status === 200);
          history.push('/');
        } else {
          setMsg(data.msg);
        }
      });
  }

  if (userLogged) {
    history.push('/');
  }

  return (
    <animated.div style={props} className="user-login-container">
      <form className="user-login-form">
        <p className="user-login-title">Welcome back, we've missed you!</p>
        <div className="user-login-form-div">
          {/* <label htmlFor="email-input-element">Email:</label> */}
          <input
            id="email-input-element"
            placeholder="Email"
            className="user-login-form-div-input"
            type="email"
            onChange={handleInputChange}
            value={inputData.email}
            required={true}
            minLength={2}
          />
        </div>
        <div className="user-login-form-div">
          {/* <label htmlFor="password-input-element">Password:</label> */}
          <input
            placeholder="Password"
            id="password-input-element"
            className="user-login-form-div-input"
            type="password"
            onChange={handleInputChange}
            value={inputData.password}
            required={true}
            minLength={8}
          />
        </div>
        <div className="user-login-form-div">
          <button
            className="user-login-form-div-button"
            onClick={handleOnClick}
          >
            Log in
          </button>
        </div>
        <div className="user-login-form-div">
          <button
            className={`user-login-form-div-button-remember-${
              remember ? 'on' : 'off'
            } user-login-form-div-button-remember`}
            onClick={(event) => {
              event.preventDefault();
              setRemember(!remember);
            }}
          ></button>
          <label htmlFor="remember-me-button">
            <i>Remember?</i>
          </label>
        </div>
        <div className="user-login-form-div">
          <button
            className="user-create-form-div-button"
            onClick={(event) => {
              event.preventDefault();
              history.push('/signup');
            }}
          >
            Create account
          </button>
        </div>
      </form>
      <div style={{ color: 'red', textAlign: 'center' }}>{msg}</div>
      <div className="user-login-lost-credentials-container">
        <Link to="/recovery">
          <i>Forgot password?</i>
        </Link>
      </div>
    </animated.div>
  );
}

export default UserLogin;
