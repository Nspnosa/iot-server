import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { useSpring, animated } from 'react-spring';

const rootElement = document.getElementById('root');

function DeviceComponent({ deviceID, ...rest }) {
  // const [status, setStatus] = useState(true);
  const [status, setStatus] = useState(false);
  const [stateOn, setStateOn] = useState(false);
  // useEffect(() => {}, [state]);

  return (
    <div className="device-container">
      <div className="device-button-container">
        <button
          className={`device-button-${status ? 'on' : 'off'}`}
          onClick={(event) => {
            setStatus(!status);
            setStateOn(!stateOn);
          }}
        >
          Actuate!
        </button>
      </div>
      <div className="device-info">
        <div className="device-info-info">
          <span className="device-info-tag">Device ID:</span>
          <span className="device-info-element">{` ${deviceID}`}</span>
        </div>
        <div className="device-info-info">
          <span className="device-info-tag">Status:</span>
          <span className="device-info-element device-info-element-status">
            {` ${status ? 'Online' : 'Offline'}`}

            <div
              className={`device-status-element-${status ? 'on' : 'off'}`}
            ></div>
          </span>
        </div>
        <div className="device-info-info">
          {/* <span className="device-info-tag">Type:</span>
          <span className="device-info-element">{` ${''} Push`}</span> */}
        </div>
      </div>
    </div>
  );
}

function UserLogin({ setCreateAccount, createAccount, ...rest }) {
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
              setCreateAccount(!createAccount);
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

function UserSignup({ setCreateAccount, createAccount, ...rest }) {
  const [inputData, setInputData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [login, setLogin] = useState(true);
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  function handleInputChange(event) {
    setInputData({
      ...inputData,
      [event.target.id.split('-')[0]]: event.target.value,
    });
    console.log(inputData);
  }

  return (
    <animated.div style={props} className="user-signup-container">
      <form className="user-signup-form">
        <p className="user-login-title">Oh, you are going to love this!</p>
        <div className="user-login-form-div">
          {/* <label htmlFor="name-input-element">Name:</label> */}
          <input
            id="name-input-element"
            placeholder="Name"
            className="user-login-form-div-input"
            type="text"
            onChange={handleInputChange}
            value={inputData.name}
          />
        </div>
        <div className="user-login-form-div">
          {/* <label htmlFor="lastname-input-element">Lastname:</label> */}
          <input
            id="lastname-input-element"
            placeholder="Lastname"
            className="user-login-form-div-input"
            type="text"
            onChange={handleInputChange}
            value={inputData.lastname}
          />
        </div>
        <div className="user-login-form-div">
          {/* <label htmlFor="email-input-element">Username:</label> */}
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
          <button className="user-login-form-div-button">Create account</button>
        </div>
        <div className="user-login-form-div">
          <div></div>
          <button
            className="user-create-form-div-button"
            onClick={(event) => {
              event.preventDefault();
              setCreateAccount(!createAccount);
            }}
          >
            Login
          </button>
        </div>
      </form>
    </animated.div>
  );
}

function App() {
  //determine if user is logged in
  const [createAccount, setCreateAccount] = useState(true);

  return (
    <div className="app-container">
      {createAccount ? (
        <UserLogin
          setCreateAccount={setCreateAccount}
          createAccount={createAccount}
        />
      ) : (
        <UserSignup
          setCreateAccount={setCreateAccount}
          createAccount={createAccount}
        />
      )}
    </div>
  );
}

ReactDOM.render(<App />, rootElement);
