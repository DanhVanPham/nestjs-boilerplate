import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchemaFactory } from './entities/user.entity';
import {
  FlashCard,
  FlashCardSchema,
} from '@modules/flash-cards/entities/flash-card.entity';
import {
  Collection,
  CollectionSchema,
} from '@modules/collection/entities/collection.entity';
import { UsersRepository } from '@repositories/users.repository';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: UserSchemaFactory,
        inject: [getModelToken(FlashCard.name), getModelToken(Collection.name)],
        imports: [
          MongooseModule.forFeature([
            { name: FlashCard.name, schema: FlashCardSchema },
            { name: Collection.name, schema: CollectionSchema },
          ]),
        ],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
