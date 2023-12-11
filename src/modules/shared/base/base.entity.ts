import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';

export class BaseEntity {
  @Expose()
  @Transform((value) => value.obj?._id?.toString(), { toClassOnly: true })
  _id?: string;

  @Prop({ default: null })
  deleted_at?: Date;
}
