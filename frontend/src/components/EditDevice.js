import { useEffect, useReducer, useState } from 'react';
import { useSpring, animated } from 'react-spring';

function EditDevice({ setOpenOptions, completeDeviceInfo, ...rest }) {
  const [deviceInfo, setDeviceInfo] = useState({
    deviceName: completeDeviceInfo.deviceName,
    newUser: '',
    subUsers: completeDeviceInfo.subUsers,
  });

  const [msg, setMsg] = useState('');
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  useEffect(() => {}, []);

  function handleOnChange(event) {
    setDeviceInfo({
      ...deviceInfo,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  async function handleOnClick(event) {}

  console.log('hello');
  return (
    <>
      <div className="user-feature-disabler-class"></div>
      <animated.div style={props} className="edit-device-container">
        <form className="user-signup-form">
          <p className="user-login-title">Edit Device</p>
          <div className="user-login-form-div">
            <input
              required={true}
              placeholder="Device Name"
              className="user-login-form-div-input"
              type="text"
              onChange={handleOnChange}
              value={deviceInfo.deviceName}
              name="deviceName"
            />
          </div>
          <div className="user-login-form-div">
            <input
              required={true}
              placeholder="New user"
              className="user-login-form-div-input"
              type="email"
              onChange={handleOnChange}
              value={deviceInfo.newUser}
              name="newUser"
            />
          </div>
          {deviceInfo.subUsers.map((user, index) => {
            return (
              <div key={user} className="user-login-form-div">
                <p>{user}</p>
                <button
                  onClick={(event) => {
                    setDeviceInfo({
                      ...deviceInfo,
                      subUsers: deviceInfo.subUsers.filter(
                        (subUser) => subUser !== user
                      ),
                    });
                  }}
                >
                  X
                </button>
              </div>
            );
          })}
          <div className="add-device-form-div">
            <button
              className="add-device-form-div-button"
              onClick={handleOnClick}
            >
              Edit device
            </button>
            <button
              className="add-device-cancel-form-div-button"
              onClick={(event) => {
                event.preventDefault();
                setOpenOptions(false);
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

export default EditDevice;
