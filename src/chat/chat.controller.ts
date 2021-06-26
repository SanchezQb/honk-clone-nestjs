import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';

import { User } from '../auth/schemas/user.schema';
import { ChatService } from './chat.service';
import { Conversation } from './schemas/conversation.schema';

@Controller('chat')
export class ChatController {

    constructor(private chatService: ChatService) { }

    @Get("/conversations")
    @UseGuards(AuthGuard())
    getConversations(@GetUser() user: User, @Query('cursor') cursor: string): Promise<Conversation[]> {
        return this.chatService.getConversations(user, cursor)
    }

    @Post("/initiate")
    @UseGuards(AuthGuard())
    initConversation(
        @GetUser() user: User,
        @Query('participant') participant: string,

    ): Promise<Conversation> {
        return this.chatService.initiateConversation(user, participant);
    }

}
