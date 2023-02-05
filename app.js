import * as dotenv from 'dotenv'
dotenv.config()

import {routes} from './routes/routs.js';
import {Router} from './libs/Http/Router/Router.js';
// import {request} from './test.js';
import http from "node:http";

function createApp(){
    const app = function(req, res, next) {
        app.handle(req, res, next);
    };

    app.handle = function handle(req, res, callback) {
        req.jsonString = '';
        req.on('data', (data) => {
            req.jsonString  += data;
        });
        const result = new Router(routes.getRoutes()).match(req)
        // final handler
        const done = callback;
        // если нет маршрутов
        if (!result) {
            console.log('no routes defined on app');
            res.setHeader("Content-Type", "application/json");
            res.writeHead(404);
            res.end(JSON.stringify({res: 'Неправильный запрос!'} ));
            return;
        }
        // передам парамеры с урла в обьект запроса
        req.params = { ...result.attributes}
        req.on('end', () => {
            result.handler(req, res, done);
        });
    };
    return app;
}

export const app = createApp();