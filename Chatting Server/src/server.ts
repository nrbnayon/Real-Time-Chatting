import colors from 'colors';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import seedAdmin from './DB';
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';

// Uncaught exception handler
process.on('uncaughtException', error => {
  errorLogger.error('UnhandleException Detected', error);
  process.exit(1);
});

let server: http.Server;
let io: Server;

async function main() {
  try {
    // Seed admin (ensure it's awaited if it's an async function)
    seedAdmin();

    // Connect to MongoDB
    mongoose.connect(config.database_url as string);
    logger.info(colors.green('🚀  Database connected successfully'));

    // Determine port
    const port =
      typeof config.port === 'number' ? config.port : Number(config.port);

    // Create HTTP server
    server = http.createServer(app);

    // Initialize Socket.IO
    io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });

    // Set up socket events
    socketHelper.socket(io);

    // Make io globally available
    //@ts-ignore
    global.io = io;

    // Start server
    server.listen(port, config.ip_address as string, () => {
      logger.info(
        colors.yellow(`♻️   Application listening on port: ${config.port}`)
      );
    });

    // Unhandled rejection handler
    process.on('unhandledRejection', error => {
      if (server) {
        server.close(() => {
          errorLogger.error('UnhandleRejection Detected', error);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to connect Database'), error);
  }
}

// SIGTERM handler
process.on('SIGTERM', () => {
  logger.info('SIGTERM IS RECEIVED');
  if (server) {
    server.close();
  }
});

// Run the main function
main();

// import colors from 'colors';
// import mongoose from 'mongoose';
// import { Server } from 'socket.io';
// import app from './app';
// import config from './config';
// import seedAdmin from './DB';
// import { socketHelper } from './helpers/socketHelper';
// import { errorLogger, logger } from './shared/logger';

// //uncaught exception
// process.on('uncaughtException', error => {
//   errorLogger.error('UnhandleException Detected', error);
//   process.exit(1);
// });

// let server: any;
// async function main() {
//   try {
//     seedAdmin();
//     mongoose.connect(config.database_url as string);
//     logger.info(colors.green('🚀  Database connected successfully'));

//     const port =
//       typeof config.port === 'number' ? config.port : Number(config.port);

//     server = app.listen(port, config.ip_address as string, () => {
//       logger.info(
//         colors.yellow(`♻️   Application listening on port:${config.port}`)
//       );
//     });

//     //socket
//     const io = new Server(server, {
//       pingTimeout: 60000,
//       cors: {
//         origin: '*',
//       },
//     });
//     socketHelper.socket(io);
//     //@ts-ignore
//     global.io = io;
//   } catch (error) {
//     errorLogger.error(colors.red('🤢 Failed to connect Database'));
//   }

//   //handle unhandleRejection
//   process.on('unhandledRejection', error => {
//     if (server) {
//       server.close(() => {
//         errorLogger.error('UnhandleRejection Detected', error);
//         process.exit(1);
//       });
//     } else {
//       process.exit(1);
//     }
//   });
// }

// main();

// //SIGTERM
// process.on('SIGTERM', () => {
//   logger.info('SIGTERM IS RECEIVE');
//   if (server) {
//     server.close();
//   }
// });
