import { BaseEntity } from '@modules/shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserRoleDocument = HydratedDocument<UserRole>;

@Schema()
export class UserRole extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
