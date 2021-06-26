import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation extends Document {
    @Prop({
        type: [{
            type: Types.ObjectId,
            ref: 'User'
        }]
    })
    participants: string[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

