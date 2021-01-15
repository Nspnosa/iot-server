import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import EditDevice from './EditDevice';

function DeviceComponent({ deviceID, deviceName, deviceInfo, ...rest }) {
  const [status, setStatus] = useState(false);
  const [stateOn, setStateOn] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const props = useSpring({ opacity: 1, from: { opacity: 0 } });
  console.log(deviceInfo);
  return (
    <>
      {!openOptions ? null : (
        <EditDevice
          completeDeviceInfo={deviceInfo}
          setOpenOptions={setOpenOptions}
        />
      )}
      <animated.div style={props} className="device-container">
        <div className="device-button-container">
          <button
            className={`device-button-${status ? 'on' : 'off'}`}
            onClick={(event) => {
              setStatus(!status);
              setStateOn(!stateOn);
            }}
          >
            Actuate!
          </button>

          <button
            className="device-options-buttons"
            onClick={(event) => {
              setOpenOptions(!openOptions);
            }}
            title="Edit device"
          >
            ...
          </button>
        </div>
        <div className="device-info">
          <div className="device-info-info">
            <span className="device-info-tag">Device ID:</span>
            <span className="device-info-element">{` ${deviceID}`}</span>
          </div>
          <div className="device-info-info">
            <span className="device-info-tag">Device Name:</span>
            <span className="device-info-element">{` ${deviceName}`}</span>
          </div>
          <div className="device-info-info">
            <span className="device-info-tag">Status:</span>
            <span className="device-info-element device-info-element-status">
              {` ${status ? 'Online' : 'Offline'}`}

              <div
                className={`device-status-element-${status ? 'on' : 'off'}`}
              ></div>
            </span>
          </div>
          <div className="device-info-info">
            {/* <span className="device-info-tag">Type:</span>
          <span className="device-info-element">{` ${''} Push`}</span> */}
          </div>
        </div>
      </animated.div>
    </>
  );
}

export default DeviceComponent;
