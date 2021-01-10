const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
// const path = require('path');
// const fs = require('fs');
// const uuid = require('uuid');
// const DeviceID = require('./models/DeviceID');
// const shortid = require('shortid');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log({ msg: 'could not connect to database' });
    } else {
      app.listen(process.env.PORT, () => {
        console.log({ msg: `Application running on port ${process.env.PORT}` });
        // uploadDeviceList();
      });
    }
  }
);
//run application

app.use(express.json());
app.use('/api', auth, require('./routes/api'));

// async function uploadDeviceList() {
//   const file = await fs.promises.readFile(path.resolve(__dirname, 'DevicesID'));
//   let match;
//   let uuidRegEx = /.{7,14}/g;
//   while ((match = uuidRegEx.exec(file))) {
//     const device = new DeviceID({
//       deviceID: match[0],
//       deviceType: 'sw',
//     });
//     device.save();
//   }
// }
// (async () => {
//   if (process.env.ADD_DEVICES) {
//     try {
//       let file = await fs.promises.readFile(
//         path.resolve(__dirname, 'DevicesID')
//       );
//     } catch {
//       console.log('here');
//       let file;
//       if (!file) {
//         file = fs.createWriteStream(path.resolve(__dirname, 'DevicesID'));
//         let deviceArray = [];
//         for (let i = 0; i < process.env.ADD_DEVICES_CNT; i++) {
//           while (true) {
//             // const deviceID = uuid.v4();
//             const deviceID = shortid.generate();
//             console.log(deviceID);
//             if (deviceArray.indexOf(deviceID) < 0) {
//               deviceArray.push(deviceID);
//               file.write(`${deviceID}\n`, 'utf-8');
//               break;
//             }
//           }
//         }
//       }
//       file.close();
//     }
//   }
// })();

//   file
//   fs.promises.readFile(path.resolve(__dirname, '/DevicesID')).then(file=>{
//     //compare with database data
//   }).catch(err)
//   fs.createWriteStream()
// }
