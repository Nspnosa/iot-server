import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useHistory, useParams } from 'react-router-dom';

function ResetAccount({ userLogged }) {
  const history = useHistory();
  const [formData, setFormData] = useState('');
  const [msg, setMsg] = useState('');
  const params = useParams();

  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  function handleInputChange(event) {
    setFormData(event.target.value);
  }

  function handleOnClick(event) {
    fetch('/api/reset', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        password: formData,
      }),
    })
      .then((data) => Promise.all([data.json(), data.status]))
      .then(([data, status]) => {
        if (status === 200) {
          history.push('/login');
        } else {
          setMsg(data.msg);
        }
      });
    event.preventDefault();
  }

  if (userLogged) {
    history.push('/');
  }

  return (
    <animated.div style={props} className="user-recovery-container">
      <form className="user-signup-form">
        <p className="user-login-title">Type in your new password</p>
        <div className="user-login-form-div">
          <input
            required={true}
            id="password-input-element"
            placeholder="Password"
            className="user-login-form-div-input"
            type="password"
            onChange={handleInputChange}
            value={formData}
          />
        </div>
        <div className="user-login-form-div">
          <button
            className="user-login-form-div-button"
            onClick={handleOnClick}
          >
            Set new password
          </button>
        </div>
      </form>
      <div style={{ color: 'red', textAlign: 'center' }}>{msg}</div>
    </animated.div>
  );
}

export default ResetAccount;
