/**
 * Module dependencies.
 */
import * as dotenv from 'dotenv'
dotenv.config()

import * as http from 'node:http';

import {app} from '../app.js';
import {connectDb} from '../libs/db.js';


/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '4000');

/**
 * Create HTTP server.
 */



/**
 * Listen on provided port, on all network interfaces.
 */
const startServer = (db) => {
  const server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  /**
   * Event listener for HTTP server "error" event.
   */
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(bind)
  }
}

connectDb().then((db)=>{
  startServer(db)
}).catch(e => {
  console.log(e)
})

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


