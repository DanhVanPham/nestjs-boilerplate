import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  Req,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import {
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { COLLECTION_LEVEL } from './entities/collection.entity';
import { RequestWithUser } from 'src/types/requests.type';
import { CreateCollectionDto } from './dto/create-collection.dto';
import {
  ApiBodyWithSingleFile,
  ApiDocsPagination,
} from 'src/decorators/swagger-form-data.decorator';
// import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collection')
@ApiTags('collection')
export class CollectionController {
  constructor(private readonly collections_service: CollectionService) {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collections_service.remove(id);
  }

  @Post()
  @ApiOperation({
    summary: 'User create their collection',
  })
  @ApiBearerAuth('token')
  @ApiBodyWithSingleFile(
    'image',
    {
      name: {
        type: 'string',
        default: 'Learn Kitchen Vocabulary',
      },
      description: { type: 'string', default: 'Some description' },
      level: {
        type: 'string',
        enum: Object.values(COLLECTION_LEVEL),
        default: COLLECTION_LEVEL.CHAOS,
      },
      is_public: {
        type: 'boolean',
        default: true,
      },
    },
    ['name', 'level', 'is_public', 'image'],
  )
  @ApiConsumes('multipart/form-data')
  create(
    @Req() request: RequestWithUser,
    @UploadedFile() image: Express.Multer.File,
    @Body() create_collection_dto: CreateCollectionDto,
  ) {
    console.log(image);
    return this.collections_service.create({
      ...create_collection_dto,
      user: request.user,
      image: image.originalname,
    });
  }

  @Get()
  @ApiDocsPagination('collection')
  // @ApiQuery({
  //   name: 'level',
  //   type: 'string',
  //   enum: COLLECTION_LEVEL,
  //   example: COLLECTION_LEVEL.MEDIUM,
  //   required: false,
  // })
  @ApiQuery({
    name: 'level',
    type: 'array',
    examples: {
      one_level_type: {
        value: [COLLECTION_LEVEL.MEDIUM],
      },
      two_level_type: {
        value: [COLLECTION_LEVEL.EASY, COLLECTION_LEVEL.HARD],
      },
    },
    required: false,
  })
  findAll(
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query(
      'level',
      //  new ParseEnumPipe(COLLECTION_LEVEL)
    )
    level: string[],
  ) {
    if (level && typeof level === 'string') {
      level = [level];
    }

    return this.collections_service.findAll({
      offset,
      limit,
      level,
    });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    examples: {
      migration_id_1: {
        value: '644293b09150e9f67d9bb75d',
        description: `Collection Kitchen vocabulary`,
      },
      migration_id_2: {
        value: '6442941027467f9a755ff76d',
        description: `Collection Sport vocabulary`,
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.collections_service.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCollectionDto: UpdateCollectionDto,
  // ) {
  //   return this.collections_service.update(+id, updateCollectionDto);
  // }
}
