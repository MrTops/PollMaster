/*
*   Offers the log function which logs some message to the console with a timestamp.
*/

const moment = require('moment')

exports.log = async message => {
    console.log(`[${moment()}] ${message}`);
};