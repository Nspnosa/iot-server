import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';

function UserSignup() {
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
            }}
          >
            Login
          </button>
        </div>
      </form>
    </animated.div>
  );
}

export default UserSignup;
