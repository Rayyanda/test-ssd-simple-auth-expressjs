//const mysql = require('mysql2');
import mysql  from 'mysql2';

const db = mysql.createConnection({
    user : 'root',
    password : '',
    host : 'localhost',
    database : 'ssd-auth'
});

db.connect((err)=>{
    if(!err){
        console.log('Connected to database');
    }
});

// module.exports = db;
export {
    db
}