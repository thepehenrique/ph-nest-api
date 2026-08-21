import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { SendMessageDto } from './dto/send-message.dto';

interface SocketAuth {
  token?: unknown;
}

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

interface SocketData {
  userId: number;
}

type AuthenticatedSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly connectedUsers = new Map<number, AuthenticatedSocket>();

  @WebSocketServer()
  private readonly server: Server;

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: AuthenticatedSocket): void {
    const auth = client.handshake.auth as SocketAuth;
    const token = auth.token;

    if (typeof token !== 'string') {
      client.disconnect();
      return;
    }

    const payload = this.jwtService.verify<JwtPayload>(token);

    client.data.userId = payload.sub;

    this.connectedUsers.set(payload.sub, client);

    const onlineUserIds = [...this.connectedUsers.keys()].filter(
      (userId) => userId !== payload.sub,
    );

    client.emit('online_users', {
      userIds: onlineUserIds,
    });

    console.log(`Usuário ${payload.sub} conectado`);

    this.server.emit('user_online', {
      userId: payload.sub,
    });
  }

  @SubscribeMessage('send_message')
  handleMessage(client: AuthenticatedSocket, data: SendMessageDto): void {
    const senderId = client.data.userId;

    const receiver = this.connectedUsers.get(data.receiverId);

    if (!receiver) {
      return;
    }

    receiver.emit('new_message', {
      senderId,
      receiverId: data.receiverId,
      content: data.content,
    });
  }

  handleDisconnect(client: AuthenticatedSocket): void {
    const userId = client.data.userId;

    if (typeof userId !== 'number') {
      return;
    }

    this.connectedUsers.delete(userId);

    console.log(`Usuário ${userId} desconectado`);

    this.server.emit('user_offline', {
      userId,
    });
  }

  @SubscribeMessage('typing')
  handleTyping(
    client: AuthenticatedSocket,
    data: { receiverId: number },
  ): void {
    const senderId = client.data.userId;

    const receiver = this.connectedUsers.get(data.receiverId);

    if (!receiver) {
      return;
    }

    receiver.emit('user_typing', {
      userId: senderId,
    });
  }
}
