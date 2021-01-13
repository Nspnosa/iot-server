import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';

function AddDevice({ close, fetchUserData, ...rest }) {
  const [deviceInfo, setDeviceInfo] = useState({
    deviceID: '',
    deviceName: '',
  });

  const [msg, setMsg] = useState('');
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  useEffect(() => {
    // function handleEsc(e) {
    //   if (e.key.toLowerCase() === 'escape') {
    //     close(true);
    //   }
    // }
    // document.addEventListener('keydown', handleEsc);
    // return () => {
    //   document.removeEventListener('keydown', handleEsc);
    // };
  }, []);

  function handleOnChange(event) {
    setDeviceInfo({
      ...deviceInfo,
      [event.target.name]: event.target.value,
    });
  }

  function handleOnClick(event) {
    const token = localStorage.getItem('iot-server-token');
    event.preventDefault();
    fetch('/api/devices', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        deviceName: deviceInfo.deviceName,
        deviceID: deviceInfo.deviceID,
      }),
    })
      .then((data) => Promise.all([data.json(), data.status]))
      .then(([data, status]) => {
        if (status === 200) {
          close(true);
        } else {
          setMsg(data.msg);
        }
      });
  }

  return (
    <>
      <div className="user-feature-disabler-class"></div>
      <animated.div
        style={props}
        className="add-device-container"
        onKeyDown={(event) => {}}
      >
        <form className="user-signup-form">
          <p className="user-login-title">Type in the code</p>
          <div className="user-login-form-div">
            <input
              required={true}
              id="code-input-element"
              placeholder="Code"
              className="user-login-form-div-input"
              type="text"
              onChange={handleOnChange}
              value={deviceInfo.deviceID}
              name="deviceID"
            />
          </div>
          <div className="user-login-form-div">
            <input
              required={true}
              id="name-input-element"
              placeholder="Name"
              className="user-login-form-div-input"
              type="text"
              onChange={handleOnChange}
              value={deviceInfo.deviceName}
              name="deviceName"
            />
          </div>
          <div className="add-device-form-div">
            <button
              className="add-device-form-div-button"
              onClick={handleOnClick}
            >
              Add device
            </button>
            <button
              className="add-device-cancel-form-div-button"
              onClick={(event) => {
                event.preventDefault();
                close(true);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
        <div style={{ color: 'red', textAlign: 'center' }}>{msg}</div>
      </animated.div>
    </>
  );
}

export default AddDevice;
