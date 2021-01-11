import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

function Recovery() {
  const [formData, setFormData] = useState('');

  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  function handleInputChange(event) {
    setFormData(event.target.value);
  }

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
      </form>
    </animated.div>
  );
}

export default Recovery;
