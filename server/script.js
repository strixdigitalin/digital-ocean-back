const args = process.argv.slice(2);
const path = require('path');

require('dotenv').config();

require('./app');

if (args.length && args[0]) {
  setTimeout(async () => {
    await require(path.join(__dirname, 'scripts', args[0]))();

    console.log('Script done');
    process.exit();
  });
} else {
  setTimeout(async () => {
    console.log('Update course lectures');
    await require('./scripts/update-media-lecture')();
    console.log('Update tutors pending status');
    await require('./scripts/update-tutor-pending-status')();
    // console.log('Add more config items');
    // await require('./scripts/add-teachwithus-number-config')();
    process.exit();
  });
}
