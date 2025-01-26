import colors from 'colors';
import { Server, Socket } from 'socket.io';
import { logger } from '../shared/logger';
import { UserService } from '../app/modules/user/user.service';

class SocketHelper {
  private static connectedSockets = new Map<string, string>();

  static socket(io: Server) {
    io.on('connection', (socket: Socket) => {
      logger.info(colors.blue(`[SocketHelper] User connected: ${socket.id}`));

      socket.on('user-online', async (userId: string) => {
        try {
          // Store socket-to-user mapping
          this.connectedSockets.set(socket.id, userId);

          logger.info(
            colors.green(`[SocketHelper] User ${userId} is now online`)
          );

          // Update user online status
          await UserService.updateUserOnlineStatus(userId, true);

          // Fetch online users
          const onlineUsers = await UserService.getOnlineUsers();
          logger.info(
            colors.green(
              `[SocketHelper] Online users found: ${onlineUsers.length}`
            )
          );

          // Emit online users to all clients
          io.emit('online-users-update', onlineUsers);
        } catch (error) {
          logger.error(
            colors.red(`[SocketHelper] Error setting user ${userId} online: `),
            error
          );
        }
      });

      socket.on('disconnect', async () => {
        const userId = this.connectedSockets.get(socket.id);

        if (userId) {
          try {
            // Check if user has any other active connections
            const userSocketCount = Array.from(
              this.connectedSockets.entries()
            ).filter(([, id]) => id === userId).length;

            // If no other connections, set user offline
            if (userSocketCount <= 1) {
              await UserService.updateUserOnlineStatus(userId, false);

              const onlineUsers = await UserService.getOnlineUsers();
              io.emit('online-users-update', onlineUsers);

              logger.info(
                colors.red(`[SocketHelper] User ${userId} set offline`)
              );
            }

            // Remove the socket from tracking
            this.connectedSockets.delete(socket.id);
          } catch (error) {
            logger.error(
              colors.red(`[SocketHelper] Error handling user disconnect: `),
              error
            );
          }
        }

        logger.info(
          colors.red(`[SocketHelper] User disconnected: ${socket.id}`)
        );
      });
    });
  }
}

export const socketHelper = SocketHelper;
