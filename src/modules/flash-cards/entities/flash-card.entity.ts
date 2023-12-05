import { BaseEntity } from '@modules/shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@modules/users/entities/user.entity';
import { Topic } from '@modules/topics/entities/topic.entity';
import { Collection } from '@modules/collection/entities/collection.entity';

export type FlashCardDocument = HydratedDocument<FlashCard>;

@Schema({
    collection: 'flash-cards',
})
export class FlashCard extends BaseEntity {
    @Prop({ required: true })
    vocabulary: string;

    @Prop({ required: true })
    image: string;

    @Prop({ required: true })
    definition: string;

    @Prop({ required: true })
    meaning: string;

    @Prop()
    pronunciation?: string;

    @Prop({ type: [String], default: [] })
    examples: string[];

    @Prop()
    order: string;

    @Prop({ default: false })
    is_public: boolean;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        required: true,
    })
    user: User;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Topic.name }] })
    topics: Topic[];

    // @Prop({
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: Collection.name,
    // })
    // collection: Collection;
}

export const FlashCardSchema = SchemaFactory.createForClass(FlashCard);
