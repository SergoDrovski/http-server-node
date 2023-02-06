import {RouteCollection} from '../libs/Http/Router/Router.js';
export const routes = new RouteCollection();

routes.get('/api/users', (req, res) => {
    res.json({res: 'ok'});
})
routes.get('/api/users/{userId}', (req, res) => {
    let id = req.params['userId']
    res.json({id});
})
routes.post('/api/users', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(req.jsonString));
})