import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  IsArray,
  IsEnum,
  ArrayMinSize,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from './create-address.dto';
import { LANGUAGES } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(50)
  first_name: string;

  @IsNotEmpty()
  @MaxLength(50)
  last_name: string;

  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(LANGUAGES, { each: true })
  interested_languages: LANGUAGES[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  addressArr?: CreateAddressDto[];
}
