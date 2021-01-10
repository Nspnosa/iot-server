import React from 'react';

function DeviceComponent({ deviceID, ...rest }) {
  // const [status, setStatus] = useState(true);
  const [status, setStatus] = useState(false);
  const [stateOn, setStateOn] = useState(false);
  // useEffect(() => {}, [state]);

  return (
    <div className="device-container">
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
      </div>
      <div className="device-info">
        <div className="device-info-info">
          <span className="device-info-tag">Device ID:</span>
          <span className="device-info-element">{` ${deviceID}`}</span>
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
    </div>
  );
}

export default DeviceComponent;
