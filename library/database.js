const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'db_pwm',
    password: '',
});

connection.connect(error => {
    if(!!error) {
        console.log(error);
    }else {
        console.log('Connection Success');
    }
});

module.exports = connection;