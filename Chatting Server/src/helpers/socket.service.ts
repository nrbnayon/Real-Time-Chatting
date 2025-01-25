// src\helpers\socket.service.ts
import { Server, Socket } from 'socket.io';
import { UserService } from '../app/modules/user/user.service';

class SocketService {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.initializeSocketEvents();
  }

  private initializeSocketEvents() {
    this.io.on('connection', (socket: Socket) => {
      console.log('New socket connection established');

      // User goes online
      socket.on('user-online', async (userId: string) => {
        console.log(`Socket: User ${userId} is now online`);
        try {
          await UserService.updateUserOnlineStatus(userId, true);
          this.io.emit('online-users-update');
        } catch (error) {
          console.error('Error setting user online:', error);
        }
      });

      // User goes offline
      socket.on('disconnect', async () => {
        console.log('Socket disconnected');
        // Optional: Implement user offline logic with a timestamp
      });
    });
  }

  getIO() {
    return this.io;
  }
}

export default SocketService;
