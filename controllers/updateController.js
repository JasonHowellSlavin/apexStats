const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_SECRET,
    database: 'GameStats',
});

function amendRequest(request) {
    let amendedRequest = {user: 1, kills: 0, damage: 0, win: 0, place: 0, date: '', time: ''};

    if (request.place === '1') {
        amendedRequest['win'] = 1;
    }

    return Object.assign({}, amendedRequest, request);
}

function updateStats(reqObj) {
    let reqArray = Object.values(reqObj);
    console.log(reqObj, reqArray);

    connection.query('INSERT INTO ApexStats(user, kills, damage, win, place, date, time) VALUES (?, ?, ?, ?, ?, ?, ?)',
    reqArray,
    (err) => {
        if (err) throw err;
        console.log('Updated stats table with values in request');
        reqArray.forEach(value => console.log(value));
    });
}

exports.update = (req, res) => {
    console.log(`This is the body of the request: ${req.body}`);

    let requestObject = amendRequest(req.body);
    console.log(`This is the value of the amended request: ${amendRequest(req.body)}`);

    console.log('Updating stats....')
    updateStats(requestObject);

    res.send({success: 'Succesfully updated stats'});
}
