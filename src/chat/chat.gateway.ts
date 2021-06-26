import { BadRequestException } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { CreateChatMessage } from './dto/chat.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private authService: AuthService
  ) { }


  @WebSocketServer() wss: Server

  afterInit(server: any) {
  }


  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    const found = await this.authService.getUser(client.handshake.query.user)
    if (!found) {
      throw new BadRequestException("You are not a user")
    }
    found.socketId = client.id;
    await found.save();
    console.log(`${client.id} Connected`)
    return { success: `${client.handshake.query.user} Connected` }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const found = await this.authService.getUser(client.handshake.query.user)
    if (!found) {
      throw new BadRequestException("You are not a user")
    }
    found.socketId = null;
    await found.save();
    console.log(`${client.id} Disconnected`)
  }


  @SubscribeMessage('msgToServer')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: CreateChatMessage) {
    const receiver = await this.authService.getUser(payload.receiver)
    if (!receiver) return
    if (receiver.socketId) {
      return this.wss.to(receiver.socketId).emit('msgToClient', payload)
    }
  }
}
