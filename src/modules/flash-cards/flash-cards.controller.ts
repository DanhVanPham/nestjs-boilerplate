import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { FlashCardsService } from './flash-cards.service';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { RequestWithUser } from 'src/types/requests.type';
import { SwaggerArrayConversion } from 'src/interceptors/swagger-array-conversion.interceptor';
// import { CreateFlashCardDto } from './dto/create-flash-card.dto';
// import { UpdateFlashCardDto } from './dto/update-flash-card.dto';

@Controller('flash-cards')
@ApiTags('flash-cards')
export class FlashCardsController {
  constructor(private readonly flashCardsService: FlashCardsService) {}

  @Post()
  @ApiOperation({
    summary: 'User create their new flash card',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        vocabulary: {
          type: 'string',
          default: 'provision',
        },
        definition: {
          type: 'string',
          default: 'the action of providing or supplying something for use.',
        },
        meaning: {
          type: 'string',
          default: 'sự cung cấp',
        },
        pronunciation: {
          type: 'string',
          default: 'prəˈviZHən',
        },
        examples: {
          type: 'array',
          items: {
            type: 'string',
            default: '',
          },
          default: [
            'new contracts for the provision of services',
            'low levels of social provision',
            'civilian contractors were responsible for provisioning these armies',
          ],
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['vocabulary', 'definition', 'meaning', 'image'],
    },
  })
  @UseInterceptors(new SwaggerArrayConversion('examples'))
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAccessTokenGuard)
  create(
    @Req() request: RequestWithUser,
    @UploadedFile() image: Express.Multer.File,
    @Body() createFlashCardDto: CreateFlashCardDto,
  ) {
    return this.flashCardsService.create({
      ...createFlashCardDto,
      user: request.user,
      image: image.originalname,
    });
  }

  @Get()
  findAll() {
    return this.flashCardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashCardsService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFlashCardDto: UpdateFlashCardDto,
  // ) {
  //   return this.flashCardsService.update(+id, updateFlashCardDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashCardsService.remove(id);
  }
}
