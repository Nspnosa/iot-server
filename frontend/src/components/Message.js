import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

function Message({ messages, ...rest }) {
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
    <animated.div style={props} className="user-welcome-container">
      {messages.map((message, index) => {
        return (
          <p key={index} style={{ textAlign: 'center' }}>
            {message.toUpperCase()}
          </p>
        );
      })}
    </animated.div>
  );
}

export default Message;
