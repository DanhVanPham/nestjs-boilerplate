import { BaseEntity } from '@modules/shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@modules/users/entities/user.entity';
import { Topic } from '@modules/topics/entities/topic.entity';

export type CollectionDocument = HydratedDocument<Collection>;

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
})
export class Collection extends BaseEntity {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ default: 1 })
    level: number;

    @Prop({ required: true })
    order: string;

    @Prop()
    image: string;

    @Prop({ default: false })
    isPublic: boolean;

    @Prop({ default: 0 })
    total_flash_card: number;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
    })
    user: User;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Topic.name,
    })
    topic: Topic;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
