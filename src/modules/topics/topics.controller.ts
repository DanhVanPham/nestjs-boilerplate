import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
// import { CreateTopicDto } from './dto/create-topic.dto';
// import { UpdateTopicDto } from './dto/update-topic.dto';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { Public } from 'src/decorators/auth.decorators';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorators';
import { USER_ROLE } from '@modules/user-roles/entities/user-role.entity';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { CreateTopicDto } from './dto/create-topic.dto';
import { RequestWithUser } from 'src/types/requests.type';
import { ApiBodyWithMultipleFile } from 'src/decorators/swagger-form-data.decorator';

@Controller('topics')
@ApiTags('topics')
@UseGuards(JwtAccessTokenGuard)
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  @ApiOperation({
    summary: 'Admin create topic',
  })
  @ApiBearerAuth('token')
  @ApiBodyWithMultipleFile(
    'images',
    {
      name: {
        type: 'string',
        default: 'Learn Kitchen Vocabulary',
      },
      description: { type: 'string', default: 'Some description' },
    },
    ['name', 'images'],
  )
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAccessTokenGuard)
  create(
    @Req() request: RequestWithUser,
    @UploadedFiles() images: Express.Multer.File,
    @Body() createTopicDto: CreateTopicDto,
  ) {
    console.log(images);
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
  //   return this.topicsService.update(+id, updateTopicDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }
}
