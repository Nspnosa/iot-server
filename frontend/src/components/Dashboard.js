//TODO: Dashboard should get user data on mount
//TODO: Dashboard should get user data every 10 seconds
//TODO: Dashboard should get user data when the user changes the state of one component
import { useEffect, useState } from 'react';
import { useSpring } from 'react-spring';
import Device from './Device';
import AddDevice from './AddDevice';

function Dashboard() {
  const [closeDisplayAddDevice, setCloseDisplayAddDevice] = useState(true);
  const [devices, setDevices] = useState([]);

  const token = localStorage.getItem('iot-server-token');
  console.log(token);
  async function fetchUserData() {
    await fetch('/api/devices', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => {
        return Promise.all([data.json(), data.status]);
      })
      .then(([data, status]) => {
        if (status === 200) {
          setDevices(data.devices);
        } else {
          setDevices([]);
        }
      });
  }

  function onClickHandle(event) {
    setCloseDisplayAddDevice(!closeDisplayAddDevice);
  }

  useEffect(() => {
    console.log('effect triggered');
    fetchUserData();
  }, [closeDisplayAddDevice]);

  return (
    <>
      {closeDisplayAddDevice ? null : (
        <AddDevice
          close={setCloseDisplayAddDevice}
          fetchUserData={fetchUserData}
        />
      )}
      <div className="dashboard-container">
        <div className="dashboard-options-container">
          <button
            className="add-device-cancel-form-div-button"
            onClick={onClickHandle}
          >
            Add device
          </button>
        </div>
        <div className="dashboard-devices-container">
          {devices.map((device) => {
            return (
              <Device
                deviceID={device.deviceID}
                deviceName={device.deviceName}
                deviceInfo={device}
                key={device._id}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
