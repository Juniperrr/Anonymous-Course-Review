const mongoose = require("mongoose");

let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file, and use blocking file io to do this...
    const fs = require('fs');
    const path = require('path');
    const fn = path.join(__dirname, '../config.json');
    const data = fs.readFileSync(fn);
    // our configuration file will be in json, so parse it and set the conenction string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    // if we're not in PRODUCTION mode, then use
    dbconf = 'mongodb://localhost/hw05';
}
console.log('connecting to mongoose', dbconf);

mongoose.connect(dbconf, { useNewUrlParser: true, useUnifiedTopology: true })
.then(resolved => console.log('db connected!'))
.catch(err => console.log('error connecting to the database', err));