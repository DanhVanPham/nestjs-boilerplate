import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsOptional,
  IsPhoneNumber,
  IsDateString,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { GENDER } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['username', 'password', 'email']),
) {
  @IsOptional()
  @IsPhoneNumber()
  phone_number?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;

  @IsOptional()
  @IsEnum(GENDER)
  gender?: string;

  @IsOptional()
  @MaxLength(200)
  headline?: string;
}
