var fire = require("firebase-admin");

var serviceAccount = require("../db-recepku-firebase-adminsdk-s0rfd-2866371068.json");

fire.initializeApp({
  credential: fire.credential.cert(serviceAccount)
});

//export module
module.exports = fire;