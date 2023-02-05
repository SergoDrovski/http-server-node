import {RouteCollection} from '../libs/Http/Router/Router.js';
export const routes = new RouteCollection();

routes.get('/api/users', (req, res) => console.log(['users']))
routes.get('/api/users/{userId}', (req) => console.log(req))
routes.post('/api/users', (req) => console.log('создаём пользователя !!!'))