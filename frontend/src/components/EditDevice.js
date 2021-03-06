import { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';

function EditDevice({
  setOpenOptions,
  completeDeviceInfo,
  fetchUserData,
  ...rest
}) {
  const [deviceInfo, setDeviceInfo] = useState({
    deviceName: completeDeviceInfo.deviceName,
    newUser: '',
    subUsers: completeDeviceInfo.subUsers,
  });
  const token = localStorage.getItem('iot-server-token');
  const [msg, setMsg] = useState('');
  const [enableEditButton, setEnableEditButton] = useState(false);

  const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  useEffect(() => {
    if (
      deviceInfo.deviceName !== completeDeviceInfo.deviceName ||
      deviceInfo.newUser !== ''
    ) {
      //activate edit device button
      setEnableEditButton(true);
    } else {
      //deactivate
      setEnableEditButton(false);
    }
  }, [deviceInfo]);

  function handleOnChange(event) {
    setDeviceInfo({
      ...deviceInfo,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  async function handleOnClick(event) {}

  async function removeDevice(event) {
    event.preventDefault();
    await fetch(`/api/devices/${completeDeviceInfo.deviceID}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => Promise.all([data.json(), data.status]))
      .then(([data, status]) => {
        if (status !== 200) {
          setMsg(data.msg);
        } else {
          fetchUserData();
        }
      });
  }

  async function editDevice(event) {
    event.preventDefault();
    let bodyObject = {};
    if (deviceInfo.deviceName !== completeDeviceInfo.deviceName) {
      bodyObject.deviceName = deviceInfo.deviceName;
    }
    if (deviceInfo.newUser) {
      bodyObject.subUser = deviceInfo.newUser;
    }
    await fetch(`/api/devices/${completeDeviceInfo.deviceID}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...bodyObject }),
    })
      .then((data) => Promise.all([data.json(), data.status]))
      .then(([data, status]) => {
        if (status !== 200) {
          setMsg(data.msg);
        } else {
          fetchUserData();
          setEnableEditButton(false);
        }
      });
  }

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
              disabled={!completeDeviceInfo.owned}
            />
          </div>
          {completeDeviceInfo.owned ? (
            <div className="user-login-form-div">
              <input
                placeholder="New user"
                className="user-login-form-div-input"
                type="email"
                onChange={handleOnChange}
                value={deviceInfo.newUser}
                name="newUser"
              />
            </div>
          ) : null}

          <div
            className="user-login-form-div"
            style={{ height: 20, marginBottom: 0 }}
          >
            <p style={{ margin: 0 }}>
              {!completeDeviceInfo.owned ? <b>Owned by:</b> : null}
              {completeDeviceInfo.owned &&
              completeDeviceInfo.subUsers.length ? (
                <b>Shared with:</b>
              ) : null}
            </p>
          </div>

          {completeDeviceInfo.owned ? (
            deviceInfo.subUsers.map((user, index) => {
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
            })
          ) : (
            <div className="user-login-form-div">
              <p>{completeDeviceInfo.userEmail}</p>
            </div>
          )}
          <div className="add-device-form-div">
            {completeDeviceInfo.owned ? (
              <button
                className={`add-device-form-div-button${
                  !enableEditButton ? '-disabled' : ''
                }`}
                onClick={editDevice}
                disabled={!enableEditButton}
              >
                Edit device
              </button>
            ) : null}

            <button
              className="add-device-cancel-form-div-button"
              onClick={(event) => {
                event.preventDefault();
                setOpenOptions(false);
              }}
            >
              Close
            </button>
          </div>
          <div className="add-device-form-div">
            <button
              className="remove-device-form-div-button"
              onClick={removeDevice}
            >
              {completeDeviceInfo.owned ? 'Free' : 'Remove'}
            </button>
          </div>
        </form>
        <div style={{ color: 'red', textAlign: 'center' }}>{msg}</div>
      </animated.div>
    </>
  );
}

export default EditDevice;
