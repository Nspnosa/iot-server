import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

function Welcome({ type, ...rest }) {
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
    <animated.div style={props} className="user-welcome-container">
      <p style={{ textAlign: 'center' }}>WELCOME TO</p>
      <p style={{ textAlign: 'center' }}>IOT-SERVER</p>
    </animated.div>
  );
}

export default Welcome;
