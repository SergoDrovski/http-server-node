export class RouteCollection {
    constructor() {
        this.routes = [];
    }
    addRoute(route){
        this.routes.push(route);
    }
    get(pattern, handler){
        this.addRoute(new RegexpRoute(pattern, handler, ['GET']))
    }
    post(pattern, handler){
        this.addRoute(new RegexpRoute(pattern, handler, ['POST', 'OPTIONS']))
    }
    put(pattern, handler){
        this.addRoute(new RegexpRoute(pattern, handler, ['PUT']))
    }
    getRoutes() {
        return this.routes;
    }
}

class RegexpRoute {
    constructor(pattern, handler, methods) {
        this.pattern = pattern;
        this.handler = handler;
        this.methods = methods;
    }

    match(request) {
        // Проверяем совпадение метода в запросе с методами маршрутов

        if(this.methods && !this.methods.includes(request.method)){
            return null;
        }

        // Получаем путь
        const path = new URL(request.url, `http://${request.headers.host}`);
        const pathname = path.pathname + path.search;
        // api/users/{userId}
        // api/users

        // /\/api/users\/(?<name>[a-zA-Z|\d]+)/m;

        // Получаем рег.выражение для извлечения пути из URLa
        const pattern = this.pattern.replace(/\{([^\}]+)\}/, function (match, p1) {
            return '(?<' + p1 + '>[a-zA-Z|\\d]+)';
        });

        const addSlashesPattern = new RegExp(pattern);



        const res = pathname.match(addSlashesPattern);

        if (res && res[0] === res.input) {
            return new Result(
                this.pattern,
                res.input,
                this.handler,
                res.groups
            );
        }
        return null;
    }
}

class Result {
    constructor(pattern, url, handler, attributes) {
        this.pattern = pattern;
        this.url = url;
        this.handler = handler;
        this.attributes = { ...attributes };
    }

    getPattern() {
        return this.pattern;
    }

    getUrl() {
        return this.url;
    }

    getHandler() {
        return this.handler;
    }

    getAttributes() {
        return this.attributes;
    }
}

export class Router {
    constructor(RouteCollection) {
        this.routeCollection = RouteCollection;
    }

    match(request) {
        try{
            for(let route of this.routeCollection) {
                const result = route.match(request);
                if (result) {
                    return result;
                }
            }
            return null;
        }catch (e) {
            return e;
        }
    }
}

// let req = {
//     method: 'POST',
//     url: '/api/users',
//     headers: {
//         host: 'localhost:3000'
//     }
// }
// let res = new RegexpRoute('/api/users', (req) => console.log(req), 'GET').match(req)
// console.log(res)

// let routes = new RouteCollection();
// routes.get('/api/users', (req, res) => console.log(['users']))
// routes.get('/api/users/{userId}', (req) => console.log(req))
// routes.post('/api/users', (req) => console.log('создаём пользователя !!!'))
// let result = new Router(routes.getRoutes()).match(req)
// result.handler(result.attributes)