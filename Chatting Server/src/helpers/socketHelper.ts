import colors from 'colors';
import { Server, Socket } from 'socket.io';
import { logger } from '../shared/logger';
import { UserService } from '../app/modules/user/user.service';

class SocketHelper {
  static socket(io: Server) {
    io.on('connection', (socket: Socket) => {
      logger.info(colors.blue(`A user connected: ${socket.id}`));

      // User goes online
      socket.on('user-online', async (userId: string) => {
        try {
          logger.info(colors.green(`User ${userId} is now online`));
          await UserService.updateUserOnlineStatus(userId, true);
          io.emit('online-users-update');
        } catch (error) {
          logger.error(
            colors.red(`Error setting user ${userId} online: `),
            error
          );
        }
      });

      // User goes offline
      socket.on('disconnect', async () => {
        try {
          logger.info(colors.red(`A user disconnected: ${socket.id}`));
          // Optional: Implement offline status update here if needed
        } catch (error) {
          logger.error(colors.red('Error handling user disconnect'), error);
        }
      });
    });
  }
}

export const socketHelper = SocketHelper;

// import colors from 'colors';
// import { Server } from 'socket.io';
// import { logger } from '../shared/logger';

// const socket = (io: Server) => {
//   io.on('connection', socket => {
//     logger.info(colors.blue('A user connected'));

//     //disconnect
//     socket.on('disconnect', () => {
//       logger.info(colors.red('A user disconnect'));
//     });
//   });
// };

// export const socketHelper = { socket };
