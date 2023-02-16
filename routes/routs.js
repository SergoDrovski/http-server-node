import {RouteCollection} from '../libs/Http/Router/Router.js';
import { userScheme } from '../models/UserSchema.js';
import { ResponseSchema as  Response } from '../libs//Http/Response/ResponseSchema.js';
export const routes = new RouteCollection();

routes.get('/api/users',  async (req, res) => {
    try {
        let users = await userScheme.find({});
        res.json(new Response(200, users));
    } catch (e) {
        res.status(404);
        res.json(new Response(404, null, e.message));
    }
})

routes.post('/api/users', async (req, res) => {
    try {
        let data = JSON.parse(req.jsonString);
        let newUser = await userScheme.save(data);
        res.json(new Response(200, newUser));
    } catch (e) {
        res.status(404);
        res.json(new Response(404, null, e.message));
    }
})

routes.get('/api/users/{userId}', async (req, res) => {
    try {
        let id = req.params['userId'];
        let user = await userScheme.findById(id);
        if(!user) throw new Error('user not found !')
        res.json(new Response(200, user));
    } catch (e) {
        res.status(404);
        res.json(new Response(404, null, e.message));
    }
})

routes.put('/api/users/{userId}', async (req, res) => {
    try {
        let id = req.params['userId'];
        let data = JSON.parse(req.jsonString);
        let updateUser = await userScheme.updateOne({_id: id}, data);
        res.json(new Response(200, updateUser));
    } catch (e) {
        res.status(404);
        res.json(new Response(404, null, e.message));
    }
})

routes.delete('/api/users/{userId}', async (req, res) => {
    try {
        let id = req.params['userId'];
        let user = await userScheme.deleteOne({_id: id});
        if(!user) throw new Error('user not found !')
        res.json(new Response(200, user));
    } catch (e) {
        res.status(404);
        res.json(new Response(404, null, e.message));
    }
})