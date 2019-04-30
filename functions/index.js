const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
exports.resizeImage = functions.storage.object().onFinalize(event => {
  console.log(event);
  return;
});