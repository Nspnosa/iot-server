import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Message from './Message';
import { useHistory, Link } from 'react-router-dom';

function Recovery({ userLogged, ...rest }) {
  const history = useHistory();
  const [formData, setFormData] = useState('');
  const [msg, setMsg] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  function handleInputChange(event) {
    setFormData(event.currentTarget.value);
  }

  async function handleOnClick(event) {
    await fetch('/api/loginrecovery', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: formData,
      }),
    })
      .then((data) => Promise.all([data.json(), data.status]))
      .then(([data, status]) => {
        if (status === 200) {
          setEmailSent(true);
          setMsg('');
        } else {
          setMsg(data.msg);
        }
      });
    event.preventDefault();
  }

  if (userLogged) {
    history.push('/');
  }

  if (!emailSent) {
    return (
      <animated.div style={props} className="user-recovery-container">
        <form className="user-signup-form">
          <p className="user-login-title">Wait... Who are you again?</p>
          <div className="user-login-form-div">
            <input
              required={true}
              id="email-input-element"
              placeholder="Email"
              className="user-login-form-div-input"
              type="email"
              onChange={handleInputChange}
              value={formData}
            />
          </div>
          <div className="user-login-form-div">
            <button
              className="user-login-form-div-button"
              onClick={handleOnClick}
            >
              Send email recovery
            </button>
          </div>
        </form>
        <div style={{ color: 'red', textAlign: 'center' }}>{msg}</div>
      </animated.div>
    );
  } else {
    return <Message messages={['Please check you email']} />;
  }
}

export default Recovery;
