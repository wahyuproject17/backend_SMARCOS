require('dotenv').config();
const conn = {
    multipleStatement: true,
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_pass,
    database: process.env.db_database,
    timezone: process.env.db_timezone,
    charset  : process.env.db_charset,
    dateStrings : process.env.dateStrings
}
module.exports = conn;
