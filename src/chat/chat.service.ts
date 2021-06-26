import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';

@Injectable()
export class ChatService {

    constructor(
        @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,

    ) { }

    async getConversations(user: User, cursor: string): Promise<Conversation[]> {
        const conversations = await this.conversationModel.find({ participants: user._id }).populate({
            path: 'participants',
        });
        return conversations
    }


    async initiateConversation(user: User, participant: string): Promise<Conversation> {
        const participants = [user._id, participant];
        const foundConversation = await this.conversationModel.findOne({ participants: { $all: participants } })

        if (!foundConversation) {
            const newConversation = new this.conversationModel({
                participants: [user._id, participant]
            })
            return await newConversation.save();
        }
        return foundConversation;
    }
}
