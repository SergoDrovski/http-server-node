import request from 'supertest';
import {app} from '../app.js';
import { userScheme } from '../models/UserSchema.js';
import assert from 'node:assert/strict';

describe("Routs test", function(){
    it("rout GET api/users should return array all persons", function(done){
        request(app)
            .get("/api/users")
            .expect(function (response){
                assert.deepEqual(response.body.data, []);
            })
            .end(done);
    });

    it("rout POST /api/users should return new save user", function(done){
        request(app)
            .post("/api/users")
            .send({username: 'John', age: 33, hobbies: ['crypto']})
            .expect(function (response){

                userScheme.findOne({username: 'John'}).then(dbUser => {
                    let newUser = response.body.data;
                    assert.equal(newUser.username, 'John');
                    assert.equal(newUser.age, 33);
                    assert.equal(dbUser.username, 'John');
                    assert.equal(dbUser.age, 33);
                }).catch(e => {
                    return e;
                });

            })
            .end(function(err, res) {
                if (err) return done(err);
                return done();
            });
    });

    it("rout GET /api/users/{userId} should return one user with id", function(done){
        userScheme.find({}).then(dbUsers => {
            let user = dbUsers[0];
            let url = `/api/users/${user._id}`;
            request(app)
                .get(url)
                .expect(function (response){
                    let getUser = response.body.data;
                    assert.deepEqual(getUser, user);
                })
                .end(done);
        }).catch(e => {
            return e;
        });
    });

    it("rout PUT /api/users/{userId} should return one update user", function(done){
        userScheme.find({}).then(dbUsers => {
            let user = dbUsers[0];
            let url = `/api/users/${user._id}`;
            request(app)
                .put(url)
                .send({username: 'Linda'})
                .expect(function (response){
                    let getUser = response.body.data;
                    assert.equal(getUser._id, user._id);
                    assert.equal(getUser.username, 'Linda');
                })
                .end(done);
        }).catch(e => {
            return e;
        });
    });

    it("rout DELETE /api/users/{userId} should return null", function(done){
        userScheme.find({}).then(dbUsers => {
            let user = dbUsers[0];
            let url = `/api/users/${user._id}`;
            request(app)
                .delete(url)
                .expect(function (response){
                    userScheme.findById(user._id).then(data => {
                        debugger
                        assert.equal(data, null);
                    }).catch(e => {
                        return e;
                    });
                })
                .end(function(err, res) {
                    if (err) return done(err);
                    return done();
                });

        }).catch(e => {
            return e;
        });
    });
})
