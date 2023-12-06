import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose-class-serializer.interceptor';
import { User } from './entities/user.entity';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { USER_ROLE } from '@modules/user-roles/entities/user-role.entity';
import { RolesGuard } from '@modules/auth/guards/roles.guard';

@Controller('users')
// @UseGuards(JwtAccessTokenGuard)
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @SerializeOptions({
    excludePrefixes: ['first', 'last'],
  })
  @Get()
  @UseGuards(JwtAccessTokenGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
