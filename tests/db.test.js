import {connectDb, Schema} from '../libs/db.js';
import assert from 'node:assert/strict';

const db = connectDb();
const userScheme = new Schema("User", {
    username: {
        type: "string",
        required: true
    },
    age: {
        type: "number",
        required: true
    },
    hobbies: {
        type: "object",
        required: true
    }
}, db);


describe("User  Model  test", function () {
    it("User methods SAVE return new user", function (done) {

        const user = {username: 'Serg', age: 23, hobbies: ['programming']};

        userScheme.save(user).then(data => {
            user['_id'] = data._id;
            assert.deepEqual(data, user);
        }).then(done, done).catch(e => {
            return e;
        });
    });

    it("User methods FindById return user by ID", function (done) {

        const user2 = {username: 'Alex', age: 23, hobbies: ['testing']};

        userScheme.save(user2).then((data) => {
            user2['_id'] = data._id;

            userScheme.findById(data._id).then((findUser) => {
                assert.deepEqual(findUser, user2);
            }).then(done, done).catch(e => {
                done(e);
            });
        }).catch((e) => {
            done(e);
        });
    });

    it("User methods Find return user by Filter", function (done) {
        const user3 = {username: 'Roma', age: 33, hobbies: ['testing']};

        userScheme.save(user3).then((data) => {
            userScheme.find({username: 'Roma'}).then((findUser) => {
                let username = findUser[0].username
                assert.equal(username, 'Roma');
            }).then(done, done).catch(e => {
                done(e);
            });
        }).catch((e) => {
            done(e);
        });


    });

    it("User methods Find return All user by Filter", function (done) {

        userScheme.find({}).then((findUsers) => {
            let map = db.get("User");
            assert.equal(map.size, findUsers.length);
        }).then(done, done).catch(e => {
            done(e);
        });
    });

    it("User methods FindOne return one user by Filter", function (done) {
        const user4 = {username: 'Oleg', age: 33, hobbies: ['testing']};

        userScheme.save(user4).then((data) => {
            userScheme.find({username: 'Oleg', age: 33}).then((findUser) => {
                let username = findUser[0].username;
                let age = findUser[0].age;
                assert.equal(username, 'Oleg');
                assert.equal(age, 33);
            }).then(done, done).catch(e => {
                done(e);
            });
        }).catch((e) => {
            done(e);
        });
    });

    it("User methods updateOne return one update user by Filter", function (done) {
        userScheme.updateOne({username: 'Oleg'}, {age: 40}).then((newUser) => {
            let age = newUser.age;
            assert.equal(age, 40);
        }).then(done, done).catch(e => {
            done(e);
        });
    });

    it("User methods deleteOne return one delete user by Filter", function (done) {
        userScheme.deleteOne({username: 'Roma'}).then((data) => {
            userScheme.find({username: 'Roma'}).then((findUser) => {
                assert.deepEqual(findUser, []);
            }).then(done, done).catch(e => {
                done(e);
            });
        }).catch((e) => {
            done(e);
        });
    });
})