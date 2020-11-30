let connection = require('../database');
let bcrypt = require('bcrypt');
let s3 = require('../private/s3_aws').s3;
let rekog = require('../private/rekognition_aws').rek;
let cognitoidentityserviceprovider = require('../private/cognito_aws').cog;
let { UserPoolId, ClientId } = require('../private/cognito_aws');
let AmazonCognitoIdentity = require('amazon-cognito-identity-js');

let user_exist = (id_user) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM user WHERE id_user = "${id_user}"`, (err, rows, fields) => {
            if (err) {
                let error = new Error(err);
                error.status = 404;
                reject(error);
            }
            if (rows.length == 0) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}

let validate_user = (user) => {
    //console.log(user)
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM user WHERE id_user = "${user.id_user}"`, (err, rows, fields) => {
            //console.log(rows)
            if (err) {
                let error = new Error(err);
                error.status = 404;
                reject(error);
            }
            if (rows.length == 0) {
                resolve({ status: false, message: "User not found." });
            }
            else {
                bcrypt.compare(user.user_password_actual, rows[0].user_password, (err, result) => {
                    if (result == true) {
                        resolve({ status: true, message: "" });
                    } else {
                        resolve({ status: false, message: "Password Invalid." });
                    }
                });
            }
        });
    });
}

let get_user = (id_user) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM user WHERE id_user = "${id_user}"`, (err, rows, fields) => {
            if (err) {
                resolve({ found: false });
            }
            if (rows.length != 1) {
                resolve({ found: false });
            }
            else {
                resolve({ found: true, rows: rows[0] });
            }
        });
    });
}

let get_user2 = (id_user) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM user WHERE username = "${id_user}"`, (err, rows, fields) => {
            if (err) {
                resolve({ found: false });
            }
            if (rows.length != 1) {
                resolve({ found: false });
            }
            else {
                resolve({ found: true, rows: rows[0] });
            }
        });
    });
}

let get_friend_req = (id_friendship) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM friendship WHERE id_friendship = "${id_friendship}"`, (err, rows, fields) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows[0]);
            }
        });
    });
}

let get_user_by_id = (id_user) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM user WHERE id_user = "${id_user}"`, (err, rows, fields) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows[0]);
            }
        });
    });
}

let create_user = (body) => {
    return new Promise(async (resolve, reject) => {
        var params = {
            ClientId: 'f1nro6n9717stps5lj51cmo70',
            Username: body.username,
            Password: body.user_password,
        };

        body.user_password = await crypt_password(body.user_password);
        let querystring = '';
        if (body.image_base64 == '') {
            querystring = `INSERT INTO user(username, full_name, user_password) VALUES ('${body.username}', '${body.full_name}', '${body.user_password}')`;
        }
        else {
            let imagedata = await upload_s3_file(body.image_base64, body.username);
            querystring = `INSERT INTO user(username, full_name, user_password, user_picture_key, user_picture_location) VALUES ('${body.username}', '${body.full_name}', '${body.user_password}', '${imagedata.key}', '${imagedata.Location}')`;
        }
        connection.query(querystring, async (err, rows) => {
            if (err) {
                let error = new Error(err);
                error.status = 404;
                reject(error);
            }
            if (rows.affectedRows == 1) {
                let userinfo = await get_user2(body.username);
                cognitoidentityserviceprovider.signUp(params, function (err, data) {
                    if (err) {
                        //console.log(err, err.stack); // an error occurred
                        reject(new Error(err));
                    }
                    else {
                        console.log(data);           // successful response
                        resolve({ res1: true, res2: userinfo.rows.id_user, res3: "Se registro exitosamente"});
                    }
                });
            }
            else {
                resolve({ res1: false, res2: null, res3: "" });
            }
        });
    });
}

let get_labels = (image) => {
    return new Promise((resolve, reject) => {
        const params = {
            Image: {
                "Bytes": Buffer.from(image.split(',')[1], 'base64')
            },
            MaxLabels: 100
        }
        rekog.detectLabels(params, function (err, response) {
            if (err) {
                reject({ status: false });
            } else {
                resolve({ status: true, labels: response.Labels })
            }
        });

    });
}

let create_publishing = (body) => {
    return new Promise(async (resolve, reject) => {
        let querystring = '';
        var d = new Date();
        let imagedata = await upload_s3_file(body.image_base64, "P-" + d);
        if (!imagedata.Location) {
            resolve({ status: 500, message: "Error to save the image" })
        }
        let labels = await get_labels(body.image_base64);
        if (!labels.status) {
            resolve({ status: 500, message: "Error to get the tags" })
        }
        querystring = `INSERT INTO publishing(id_user, message, date, image) VALUES (${body.id_user}, '${body.message}', (select NOW()), '${imagedata.Location}')`;
        connection.query(querystring, (err, rows) => {
            if (err || rows.affectedRows != 1) {
                //let error = new Error(err);
                //error.status = 404;
                //reject(error);
                resolve({ status: 500, message: "Error to insert the new publishing" });
            }
            //resolve(true);
            querystring = `select LAST_INSERT_ID()`;
            connection.query(querystring, (errid, rowsid) => {
                if (errid || rowsid.length != 1) {
                    //let error = new Error(err);
                    //error.status = 404;
                    //reject(error);
                    resolve({ status: 500, message: "Error to insert the tags" });
                }
                labels.labels.forEach(label => {
                    querystring = `insert into tag(name) values ('${label.Name}')`
                    connection.query(querystring, (errt, rowst) => {
                        querystring = querystring = `select id_tag from tag where name='${label.Name}'`;
                        connection.query(querystring, (erridt, rowsidt) => {
                            if (erridt || rowsidt.affectedRows != 1) {
                                //let error = new Error(err);
                                //error.status = 404;
                                //reject(error);
                                resolve({ status: 500, message: "Error to insert the tags" });

                            }
                            querystring = `insert into publishing_tag(id_publishing, id_tag) values(${rowsid[0]['LAST_INSERT_ID()']}, ${rowsidt[0].id_tag})`
                            connection.query(querystring, (errpb, rowspb) => {

                            });

                        });
                    });
                });
                //resolve({ status: 200, message: "Publishing insert successfully" })
            });

            resolve({ status: 200, message: "Publishing insert successfully" })

        });
    });
}

let update_user = (body) => {
    return new Promise(async (resolve, reject) => {
        let querystring = '';
        if (body.user_password != "") {
            body.user_password = await crypt_password(body.user_password);
            querystring = `UPDATE user SET username='${body.username}', full_name='${body.full_name}', user_password='${body.user_password}', bot=${body.bot} where id_user=${body.id_user}`;
        } else {
            querystring = `UPDATE user SET username='${body.username}', full_name='${body.full_name}', bot=${body.bot} where id_user=${body.id_user}`;
        }

        connection.query(querystring, (err, rows) => {
            //console.log(err)
            if (err) {
                let error = new Error(err);
                error.status = 404;
                reject(error);
            }
            if (rows.affectedRows == 1) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
}

let update_user_cognito = (body) => {
    return new Promise(async (resolve, reject) => {
        const poolData = {
            UserPoolId,
            ClientId
        }

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)

        const userDetails = {
            Username: body.username,
            Pool: userPool
        }

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails);

        cognitoUser.getSession((err, session) => {
            if (err || !session.isValid()) {
                //console.log(err)
                resolve({
                    status: false,
                    message: "Error in credentials",
                    error: err.message
                })
            }
            cognitoUser.changePassword(body.user_password_actual, body.user_password, (err, data) => {
                if (err) {
                    //console.log(err)
                    resolve({
                        status: false,
                        message: "Error in credentials",
                        error: err.message
                    })
                }
                //console.log(data);
                resolve({
                    status: true,
                    message: "Pasword was change",
                })
                /*const loginDetails = {
                    Username: body.username_old,
                    Password: body.user_password
                }
                const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(loginDetails);
                cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: data => {
                        //console.log("data")
                        //console.log(data)
                        const usernameAttribute = {
                            Name: 'username',
                            Value: body.username
                        }
                        const attribute = new AmazonCognitoIdentity.CognitoUserAttribute(usernameAttribute)
                        cognitoUser.updateAttributes([attribute], (err, data) => {
                            if (err) {
                                //console.log(err)
                                resolve({
                                    state: false,
                                    message: "Error in credentials",
                                    error: err.message
                                })
                            }
                            resolve({
                                status: true,
                                data: data.getIdToken.jwtToken
                            })
                        })
                        
                    },
                    onFailure: err => {
                        //console.log("err")
                        //console.log(err)
                        resolve({
                            status: false,
                            message: "Error in credentials."
                        })
                    }
                })*/
            })
        })
    });
}

let crypt_password = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 9, (error, hash) => {
            if (error) {
                err = new Error(error);
                err.status = 404;
                reject(err);
            }
            else {
                resolve(hash);
            }

        });
    });
}

let upload_s3_file = function (screenshot, name) {
    return new Promise((resolve, reject) => {
        var screenshotname = '';
        var screenshotbody = null;
        var uploadParams = null;
        screenshotname = `users/${name}.${screenshot.substring(screenshot.indexOf('/') + 1, screenshot.indexOf(';base64'))}`;
        screenshotbody = Buffer.from(screenshot.split(",")[1], 'base64');
        uploadParams = {
            Bucket: 'usocial-grupo12',
            Key: screenshotname,
            Body: screenshotbody,
            ACL: 'public-read',
        };
        s3.upload(uploadParams, (error, data) => {
            if (error) {
                err = new Error(error);
                err.status = 404;
                reject(err);
            } if (data) {
                resolve(data);
            }
        });
    });
}

let login = (body) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM user WHERE username = "${body.username}"`, (err, rows, fields) => {
            if (err) {
                let error = new Error(err);
                error.status = 404;
                reject(error);
            }
            if (rows.length == 0) {
                resolve({ res1: false });
            }
            else {
                /*bcrypt.compare(body.user_password, rows[0].user_password, (err, result) => {
                    if (result == true) {
                        resolve({ res1: true, res2: rows[0].id_user });
                    } else {
                        resolve({ res1: false });
                    }
                });*/
                resolve({ res1: true, res2: rows[0].id_user });
            }
        });
    });
}

let login_cognito = (body) => {
    return new Promise((resolve, reject) => {

        const poolData = {
            UserPoolId,
            ClientId
        }

        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)

        const loginDetails = {
            Username: body.username,
            Password: body.user_password
        }

        const userDetails = {
            Username: body.username,
            Pool: userPool
        }

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails);

        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(loginDetails);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: data => {
                //console.log("data")
                //console.log(data)
                resolve({
                    status: true,
                    data: data.accessToken.jwtToken
                })
            },
            onFailure: err => {
                //console.log("err")
                //console.log(err)
                resolve({
                    status: false,
                    message: "Error in credentials."
                })
            }
        })
    });
}

let get_notication = (userId) => {
    let notifications = [];
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM notification WHERE id_user = "${userId}"`, async (err, rows, fields) => {
            if (err) {
                let error = new Error(err);
                error.status = 404;
                reject(error);
            }
            if (rows.length == 0) {
                resolve(notifications);
            }
            else {
                for (let notification of rows) {
                    if (notification.notification_type == 1) {
                        let friend_req = await get_friend_req(notification.notification_reference);
                        let friend_info = await get_user_by_id(friend_req.friend1);
                        if (friend_info.user_picture_key == null) {
                            notifications.push({
                                id_notification: notification.id_notification,
                                type: 1,
                                msg: `${friend_info.full_name} te ha enviado una nueva solicitud de amistad`,
                                img: '',
                                id_friendship: notification.notification_reference,
                                leida: notification.leida
                            })
                        }
                        else {
                            notifications.push({
                                id_notification: notification.id_notification,
                                type: 1,
                                msg: `${friend_info.full_name} te ha enviado una nueva solicitud de amistad`,
                                img: `${friend_info.user_picture_location}`,
                                id_friendship: notification.notification_reference,
                                leida: notification.leida
                            })
                        }
                    }
                    else if (notification.notification_type == 2) {
                        let otherinfo = await get_user_by_id(notification.notification_reference);
                        if (otherinfo.user_picture_key == null) {
                            notifications.push({
                                id_notification: notification.id_notification,
                                type: 2,
                                msg: `${otherinfo.full_name} ha aceptado tu solicitud de amistad`,
                                img: '',
                                id_reference: notification.notification_reference,
                                leida: notification.leida
                            })
                        }
                        else {
                            notifications.push({
                                id_notification: notification.id_notification,
                                type: 2,
                                msg: `${otherinfo.full_name} ha aceptado tu solicitud de amistad`,
                                img: `${otherinfo.user_picture_location}`,
                                id_reference: notification.notification_reference,
                                leida: notification.leida
                            })
                        }
                    }
                }
                resolve(notifications);
            }
        });
    });
}

let delete_notification = (id_notification) => {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM notification WHERE id_notification = "${id_notification}"`, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

let update_friendship = (friendship) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE friendship SET confirmed = ${friendship.statusfriendship} WHERE id_friendship = ${friendship.id_friendship}`, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

let people_mayknow = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT u.id_user, u.full_name, u.user_picture_location FROM 
        user u
        LEFT JOIN ( SELECT friend1 AS id_user FROM friendship WHERE friend2 = ${id} UNION SELECT friend2 AS id_user FROM friendship WHERE friend1 = ${id} ) f
        ON u.id_user = f.id_user
        WHERE f.id_user IS NULL AND u.id_user != ${id};`, (err, rows, fields) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}

let add_friend = (body) => {
    return new Promise(async (resolve, reject) => {
        let querystring = `INSERT INTO friendship(friend1, friend2, confirmed) VALUES(${body.friend1},${body.friend2},0)`;
        connection.query(querystring, (err, rows) => {
            if (err) {
                let error = new Error(err);
                error.status = 404;
                reject(error);
            }
            if (rows.affectedRows == 1) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
}

let add_notification = (body) => {
    return new Promise(async (resolve, reject) => {
        let querystring = `INSERT INTO notification(id_user, notification_type, notification_reference) VALUES(${body.id_user},${body.notification_type},${body.notification_reference})`;
        connection.query(querystring, (err, rows) => {
            if (err) {
                let error = new Error(err);
                error.status = 404;
                reject(error);
            }
            if (rows.affectedRows == 1) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });
};

let get_friendship = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM 
        friendship
        WHERE id_friendship = ${id};`, (err, rows, fields) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    });
}

let update_notification = (body) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE notification SET leida = ${body.leida} WHERE id_notification = ${body.id_notification}`, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}


exports.update_notification = update_notification;
exports.get_friendship = get_friendship;
exports.get_user_by_id = get_user_by_id;
exports.add_notification = add_notification;
exports.add_friend = add_friend;
exports.people_mayknow = people_mayknow;
exports.update_friendship = update_friendship;
exports.delete_notification = delete_notification;
exports.get_notication = get_notication;
exports.user_exist = user_exist;
exports.create_user = create_user;
exports.get_labels = get_labels;
exports.create_publishing = create_publishing;
exports.update_user = update_user;
exports.update_user_cognito = update_user_cognito;
exports.get_user = get_user;
exports.validate_user = validate_user;
exports.crypt_password = crypt_password;
module.exports.login = login;
module.exports.login_cognito = login_cognito;