import * as dotenv from 'dotenv'
dotenv.config()

import {routes} from './routes/routs.js';
import {Router} from './libs/Http/Router/Router.js';

function createApp(){
    const app = function(req, res, next) {
        app.handle(req, res, next);
    };

    app.handle = function handle(req, res, callback) {
        const result = new Router(routes.getRoutes()).match(req)


        // final handler
        const done = callback;

        // no routes
        if (!result) {
            console.log('no routes defined on app');
            return;
        }
        result.handler(req, res, done);
    };
    return app;
}

export const app = createApp();