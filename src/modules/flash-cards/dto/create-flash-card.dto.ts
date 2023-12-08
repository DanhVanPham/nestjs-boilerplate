import { IsNotEmpty, IsOptional, IsArray, ArrayMinSize } from 'class-validator';
import { User } from '@modules/users/entities/user.entity';

export class CreateFlashCardDto {
  @IsNotEmpty()
  vocabulary: string;

  image: string;

  @IsNotEmpty()
  definition: string;

  @IsNotEmpty()
  meaning: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  examples?: string[];

  @IsOptional()
  pronunciation: string;

  user?: User;
}
