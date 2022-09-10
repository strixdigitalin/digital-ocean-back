const mongoose = require('mongoose');

const MONGOOSE_RECONNECT_MS = 1000;
// const mongURI = 'mongodb+srv://lakheraakshay:Akshaylakhera@cluster0.qo4hk.mongodb.net/?tlsInsecure=true&retryWrites=true&w=majority';
async function reconnect() {
  const uri = process.env.MONGO_URI;
  console.log(uri, '<<<<< uri \n\n');
  // eslint-disable-next-line no-return-await
  return await mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    // eslint-disable-next-line arrow-parens
    .then(result => {
      console.log('connected');
      return result;
    })
    // eslint-disable-next-line arrow-parens
    .catch(err => {
      console.log('ERROR WHILE CONNECTION DATABASE ');
      console.log('>>>>>>>');
    });

  // return new Promise(async resolve => {
  //   try {
  //     crossOriginIsolated.log('connection mongoose \n\n');
  //     await mongoose.connect(process.env.MONGO_URI, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       useCreateIndex: true
  //       // useFindAndModify: false,
  //     });
  //     resolve();
  //   } catch (err) {
  //     console.error(err);
  //     console.info(`attempting to reconnect in (${MONGOOSE_RECONNECT_MS}) ms`);
  //     setTimeout(() => {
  //       resolve(reconnect());
  //     }, MONGOOSE_RECONNECT_MS);
  //   }
  // });

  return;
}

// exports.core = async () => {
//   console.log('\n\n  Trying to connect mongo db');
//   await mongoose
//     .connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//       // useCreateIndex: true,
//       // useFindAndModify: false,
//     })
//     .then(result => {
//       console.log('connected');
//       return result;
//     })
//     .catch(err => {
//       console.log('ERROR WHILE CONNECTION DATABASE ');
//       console.log('>>>>>>>');
//     });
// };

exports.core = async () => {
  console.log('\n\n TRYING TO CONNECT MONGO DB\n\n\n\n');
  mongoose.connection.on('connected', () => {
    console.log('here\n\n');
    if (['development', 'test'].indexOf(process.env.NODE_ENV) > -1) {
      console.info(`mongoose connection open to ${process.env.MONGO_URI}`);
    }
  });

  // if the connection throws an error
  // mongoose.connection.on('error', console.error);

  // when the connection is disconnected
  // mongoose.connection.on('disconnected', () => console.info('mongoose disconnected'));

  // connect to mongodb
  await reconnect();

  return mongoose;
};
