import colors from 'colors';
import { Server, Socket } from 'socket.io';
import { logger } from '../shared/logger';
import { UserService } from '../app/modules/user/user.service';
import { IMessage } from '../app/modules/messages/messages.interface';

class SocketHelper {
  private static connectedSockets = new Map<string, string>();
  private static typingUsers = new Map<string, NodeJS.Timeout>();

  static socket(io: Server) {
    io.on('connection', (socket: Socket) => {
      logger.info(colors.blue(`[SocketHelper] User connected: ${socket.id}`));

      // Handle user coming online
      socket.on('user-online', async (userId: string) => {
        try {
          // Store socket-to-user mapping
          this.connectedSockets.set(socket.id, userId);

          logger.info(
            colors.green(`[SocketHelper] User ${userId} is now online`)
          );

          // Update user online status
          await UserService.updateUserOnlineStatus(userId, true);

          // Fetch and broadcast online users
          const onlineUsers = await UserService.getOnlineUsers();
          io.emit('online-users-update', onlineUsers);

          logger.info(
            colors.green(
              `[SocketHelper] Online users found: ${onlineUsers.length}`
            )
          );
        } catch (error) {
          logger.error(
            colors.red(`[SocketHelper] Error setting user ${userId} online: `),
            error
          );
        }
      });

      // Handle joining chat rooms
      socket.on('join-chat', (chatId: string) => {
        socket.join(chatId);
        logger.info(colors.cyan(`[SocketHelper] User joined chat: ${chatId}`));
      });

      // Handle leaving chat rooms
      socket.on('leave-chat', (chatId: string) => {
        socket.leave(chatId);
        logger.info(colors.cyan(`[SocketHelper] User left chat: ${chatId}`));
      });

      // Handle typing indicators
      socket.on('typing-start', (data: { chatId: string; userId: string }) => {
        const { chatId, userId } = data;

        // Clear existing timeout if any
        if (this.typingUsers.has(`${chatId}-${userId}`)) {
          clearTimeout(this.typingUsers.get(`${chatId}-${userId}`));
        }

        // Broadcast typing status to chat room
        socket.to(chatId).emit('typing-update', {
          chatId,
          userId,
          isTyping: true,
        });

        // Set timeout to automatically stop typing after 3 seconds
        const timeout = setTimeout(() => {
          socket.to(chatId).emit('typing-update', {
            chatId,
            userId,
            isTyping: false,
          });
          this.typingUsers.delete(`${chatId}-${userId}`);
        }, 3000);

        this.typingUsers.set(`${chatId}-${userId}`, timeout);
      });

      socket.on('typing-stop', (data: { chatId: string; userId: string }) => {
        const { chatId, userId } = data;

        // Clear typing timeout
        if (this.typingUsers.has(`${chatId}-${userId}`)) {
          clearTimeout(this.typingUsers.get(`${chatId}-${userId}`));
          this.typingUsers.delete(`${chatId}-${userId}`);
        }

        // Broadcast typing stopped
        socket.to(chatId).emit('typing-update', {
          chatId,
          userId,
          isTyping: false,
        });
      });

      // Handle new messages
      socket.on('new-message', (message: IMessage) => {
        if (!message.chat || !message.sender) {
          logger.error(colors.red('[SocketHelper] Invalid message format'));
          return;
        }

        // Broadcast to all users in the chat except sender
        socket.to(message.chat.toString()).emit('message-received', message);

        logger.info(
          colors.green(
            `[SocketHelper] New message broadcast in chat: ${message.chat}`
          )
        );
      });

      // Handle message read status
      socket.on(
        'message-read',
        (data: { messageId: string; chatId: string; userId: string }) => {
          const { messageId, chatId, userId } = data;

          // Broadcast read status to chat room
          socket.to(chatId).emit('message-read-update', {
            messageId,
            userId,
            chatId,
          });
        }
      );

      // Handle disconnection
      // socket.on('disconnect', async () => {
      //   const userId = this.connectedSockets.get(socket.id);

      //   if (userId) {
      //     try {
      //       // Check if user has any other active connections
      //       const userSocketCount = Array.from(
      //         this.connectedSockets.entries()
      //       ).filter(([, id]) => id === userId).length;

      //       // If no other connections, set user offline
      //       if (userSocketCount <= 1) {
      //         await UserService.updateUserOnlineStatus(userId, false);

      //         // Update last active timestamp
      //         await UserService.updateLastActive(userId);

      //         // Broadcast updated online users list
      //         const onlineUsers = await UserService.getOnlineUsers();
      //         io.emit('online-users-update', onlineUsers);

      //         logger.info(
      //           colors.yellow(`[SocketHelper] User ${userId} set offline`)
      //         );
      //       }

      //       // Clean up typing timeouts for this user
      //       for (const [key, timeout] of this.typingUsers.entries()) {
      //         if (key.includes(userId)) {
      //           clearTimeout(timeout);
      //           this.typingUsers.delete(key);
      //         }
      //       }

      //       // Remove the socket from tracking
      //       this.connectedSockets.delete(socket.id);
      //     } catch (error) {
      //       logger.error(
      //         colors.red(`[SocketHelper] Error handling user disconnect: `),
      //         error
      //       );
      //     }
      //   }

      //   logger.info(
      //     colors.red(`[SocketHelper] User disconnected: ${socket.id}`)
      //   );
      // });
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

  // Helper method to get all connected users
  static getConnectedUsers(): string[] {
    return Array.from(new Set(this.connectedSockets.values()));
  }

  // Helper method to check if a user is online
  static isUserOnline(userId: string): boolean {
    return Array.from(this.connectedSockets.values()).includes(userId);
  }
}

export const socketHelper = SocketHelper;

// import colors from 'colors';
// import { Server, Socket } from 'socket.io';
// import { logger } from '../shared/logger';
// import { UserService } from '../app/modules/user/user.service';

// class SocketHelper {
//   private static connectedSockets = new Map<string, string>();

//   static socket(io: Server) {
//     io.on('connection', (socket: Socket) => {
//       logger.info(colors.blue(`[SocketHelper] User connected: ${socket.id}`));

//       socket.on('user-online', async (userId: string) => {
//         try {
//           // Store socket-to-user mapping
//           this.connectedSockets.set(socket.id, userId);

//           logger.info(
//             colors.green(`[SocketHelper] User ${userId} is now online`)
//           );

//           // Update user online status
//           await UserService.updateUserOnlineStatus(userId, true);

//           // Fetch online users
//           const onlineUsers = await UserService.getOnlineUsers();
//           logger.info(
//             colors.green(
//               `[SocketHelper] Online users found: ${onlineUsers.length}`
//             )
//           );

//           // Emit online users to all clients
//           io.emit('online-users-update', onlineUsers);
//         } catch (error) {
//           logger.error(
//             colors.red(`[SocketHelper] Error setting user ${userId} online: `),
//             error
//           );
//         }
//       });

//       socket.on('disconnect', async () => {
//         const userId = this.connectedSockets.get(socket.id);

//         if (userId) {
//           try {
//             // Check if user has any other active connections
//             const userSocketCount = Array.from(
//               this.connectedSockets.entries()
//             ).filter(([, id]) => id === userId).length;

//             // If no other connections, set user offline
//             if (userSocketCount <= 1) {
//               await UserService.updateUserOnlineStatus(userId, false);

//               const onlineUsers = await UserService.getOnlineUsers();
//               io.emit('online-users-update', onlineUsers);

//               logger.info(
//                 colors.red(`[SocketHelper] User ${userId} set offline`)
//               );
//             }

//             // Remove the socket from tracking
//             this.connectedSockets.delete(socket.id);
//           } catch (error) {
//             logger.error(
//               colors.red(`[SocketHelper] Error handling user disconnect: `),
//               error
//             );
//           }
//         }

//         logger.info(
//           colors.red(`[SocketHelper] User disconnected: ${socket.id}`)
//         );
//       });
//     });
//   }
// }

// export const socketHelper = SocketHelper;
