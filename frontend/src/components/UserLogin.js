import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';

function UserLogin() {
  const [inputData, setInputData] = useState({
    email: '',
    password: '',
  });
  const [remember, setRemember] = useState(true);
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  function handleInputChange(event) {
    setInputData({
      ...inputData,
      [event.target.id.split('-')[0]]: event.target.value,
    });
    console.log(inputData);
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
          />
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
          <button className="user-login-form-div-button">Log in</button>
        </div>
        <div className="user-login-form-div">
          <div></div>
          <button
            className="user-create-form-div-button"
            onClick={(event) => {
              event.preventDefault();
            }}
          >
            Create account
          </button>
        </div>
      </form>
      <div className="user-login-lost-credentials-container">
        <a href="#">
          <i>Forgot password?</i>
        </a>
      </div>
    </animated.div>
  );
}

export default UserLogin;
