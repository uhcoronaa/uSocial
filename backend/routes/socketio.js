
let connection = require('../database');
var lexruntime = require('../private/lex_aws').lex;

var users = {}

module.exports = function (io) {
    io.on('connection', socket => {
        console.log("joined!!!!");

        socket.on('new user', (data, cb) => {
            if (data.id_user in users) {
            } else {
                users[data.id_user] = socket
                socket.nickname = data.id_user;
            }
            //code to change the state of this user to CONNECTED
            //emit the list of users connecteds
        })

        socket.on('message', function (data) {
            //if (data.id_user_received in users) {
            let querystring = `insert into message(id_friendship, date_sent, message, id_user_sent) values (${data.id_friendship}, (select NOW()), '${data.message}', ${data.id_user_sent})`;
            connection.query(querystring, (err, rows) => {
                if (err) {
                    data.message = "Message not sent"
                    users[data.id_user_sent].emit('new message', data);
                } else {
                    if (data.bot == 0) {
                        if (users[data.id_user_received]) {
                            users[data.id_user_received].emit('new message', data);
                        }
                        users[data.id_user_sent].emit('new message', data);
                    } else {
                        if (users[data.id_user_received]) {
                            users[data.id_user_received].emit('new message', data);
                        }
                        users[data.id_user_sent].emit('new message', data);
                        var params = {
                            botAlias: 'usocial',
                            botName: 'usocial',
                            inputText: data.message,
                            userId: 'u' + data.id_user_sent
                        };

                        lexruntime.postText(params, function (err, dat) {
                            if (err) {
                                console.log(err);
                                data.message = "Query impossible to process"
                            }
                            else {
                                data.message = dat.message;
                            }
                            let t = data.id_user_received;
                            data.id_user_received = data.id_user_sent;
                            data.id_user_sent = t;
                            querystring = `insert into message(id_friendship, date_sent, message, id_user_sent) values (${data.id_friendship}, (select NOW()), '${data.message}', ${data.id_user_sent})`;
                            connection.query(querystring, (err, rows) => {
                                if (err) {
                                    data.message = "Message not sent"
                                    users[data.id_user_sent].emit('new message', data);
                                } else {
                                    if (users[data.id_user_sent]) {
                                        users[data.id_user_sent].emit('new message', data);
                                    }
                                    users[data.id_user_received].emit('new message', data);
                                }
                            })
                        });
                    }

                }
            });
            //}
        })

        socket.on('get conversation', data => {

            let querystring = `SELECT * FROM message id_friendship=${data.id_friendship}`;
            connection.query(querystring, (err, rows) => {

                /*if (err) {
                    data.id_user_received = date.id_user_sent;
                    data.message = "Message not sent"
                    users[data.id_user_received].emit('new message', data);
                } else {
                    users[data.id_user_received].emit('new message', data);
                    users[data.id_user_sent].emit('new message', data);
                }*/
            });
            //code to change the state of this user to DISCONNECTED
            //emit the list of users connecteds
        })

        socket.on('disconnect', data => {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            //code to change the state of this user to DISCONNECTED
            //emit the list of users connecteds
        })
    })
}