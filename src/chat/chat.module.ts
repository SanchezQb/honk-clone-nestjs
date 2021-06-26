import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),

  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController]
})
export class ChatModule { }
