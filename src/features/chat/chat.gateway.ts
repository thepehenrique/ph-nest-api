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
import { CallRequestDto } from './dto/call-request.dto';
import { WebRTCAnswerDto } from './dto/web-rtc-answer.dto';
import { WebRTCOfferDto } from './dto/web-rtc-offer.dto';
import { WebRTCIceCandidateDto } from './dto/web-rtc-ice-candidate.dto';

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

    console.log(`Usuário ${payload.sub} conectado - Socket: ${client.id}`);
    console.log('Usuários online:', [...this.connectedUsers.keys()]);
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

    console.log(
      `Usuário ${client.data.userId} desconectado - Socket: ${client.id}`,
    );
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

  @SubscribeMessage('call_request')
  handleCallRequest(client: AuthenticatedSocket, data: CallRequestDto): void {
    const callerId = client.data.userId;

    const receiver = this.connectedUsers.get(data.receiverId);

    if (!receiver) {
      return;
    }

    receiver.emit('incoming_call', {
      callerId,
    });
  }

  @SubscribeMessage('call_accepted')
  handleCallAccepted(client: AuthenticatedSocket, data: CallRequestDto): void {
    const caller = this.connectedUsers.get(data.receiverId);

    if (!caller) {
      return;
    }

    caller.emit('call_accepted', {
      receiverId: client.data.userId,
    });
  }

  @SubscribeMessage('call_rejected')
  handleCallRejected(client: AuthenticatedSocket, data: CallRequestDto): void {
    const caller = this.connectedUsers.get(data.receiverId);

    if (!caller) {
      return;
    }

    caller.emit('call_rejected', {
      receiverId: client.data.userId,
    });
  }

  @SubscribeMessage('call_ended')
  handleCallEnded(client: AuthenticatedSocket, data: CallRequestDto): void {
    const receiver = this.connectedUsers.get(data.receiverId);

    if (!receiver) {
      return;
    }

    receiver.emit('call_ended', {
      userId: client.data.userId,
    });
  }

  @SubscribeMessage('webrtc_offer')
  handleOffer(client: AuthenticatedSocket, data: WebRTCOfferDto) {
    const receiver = this.connectedUsers.get(data.receiverId);

    if (!receiver) {
      return;
    }

    receiver.emit('webrtc_offer', {
      callerId: client.data.userId,
      offer: data.offer,
    });
  }

  @SubscribeMessage('webrtc_answer')
  handleAnswer(client: AuthenticatedSocket, data: WebRTCAnswerDto) {
    const receiver = this.connectedUsers.get(data.receiverId);

    if (!receiver) {
      return;
    }

    receiver.emit('webrtc_answer', {
      receiverId: client.data.userId,
      answer: data.answer,
    });
  }

  @SubscribeMessage('webrtc_ice_candidate')
  handleIceCandidate(client: AuthenticatedSocket, data: WebRTCIceCandidateDto) {
    const receiver = this.connectedUsers.get(data.receiverId);

    if (!receiver) {
      return;
    }

    receiver.emit('webrtc_ice_candidate', {
      senderId: client.data.userId,
      candidate: data.candidate,
    });
  }
}
