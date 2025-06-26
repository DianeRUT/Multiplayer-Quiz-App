import { io } from 'socket.io-client';

// IMPORTANT: Replace with your actual backend IP address or domain.
const SOCKET_URL = 'http://192.168.1.113:3000'; 

class SocketService {
  socket = null;

  connect(token) {
    if (this.socket?.connected) return;
    
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => console.log('Socket.IO Connected:', this.socket?.id));
    this.socket.on('connect_error', (err) => console.error('Socket.IO Connection Error:', err.message));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket.IO Disconnected.');
    }
  }

  emit(event, data) {
    this.socket?.emit(event, data);
  }

  on(event, callback) {
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    this.socket?.off(event, callback);
  }
}

export const socketService = new SocketService();