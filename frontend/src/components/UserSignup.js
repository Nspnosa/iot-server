import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useHistory, Link } from 'react-router-dom';

function UserSignup({ userLogged }) {
  const history = useHistory();
  const [inputData, setInputData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [msg, setMsg] = useState('');
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  async function handleOnClick(event) {
    await fetch('/api/signup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: inputData.name,
        lastname: inputData.lastname,
        email: inputData.email,
        password: inputData.password,
      }),
    })
      .then((data) => {
        return Promise.all([data.json(), data.status]);
      })
      .then(([data, status]) => {
        if (status === 200) {
          history.push('/');
        } else {
          setMsg(data.msg);
        }
      });

    event.preventDefault();
  }

  function handleInputChange(event) {
    setInputData({
      ...inputData,
      [event.currentTarget.id.split('-')[0]]: event.currentTarget.value,
    });
  }
  if (userLogged) {
    history.push('/');
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
            required={true}
            minLength={2}
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
            required={true}
            minLength={2}
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
            required={true}
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
            Create account
          </button>
        </div>
        <div className="user-login-form-div">
          <div></div>
          <button
            className="user-create-form-div-button"
            onClick={(event) => {
              event.preventDefault();
              history.push('/login');
            }}
          >
            Login
          </button>
        </div>
      </form>
      <div style={{ color: 'red', textAlign: 'center' }}>{msg}</div>
    </animated.div>
  );
}

export default UserSignup;
