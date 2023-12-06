import {
  Controller,
  Get,
  // Post,
  // Body,
  // Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
// import { CreateTopicDto } from './dto/create-topic.dto';
// import { UpdateTopicDto } from './dto/update-topic.dto';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { Public } from 'src/decorators/auth.decorators';

@Controller('topics')
@UseGuards(JwtAccessTokenGuard)
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  // @Post()
  // create(@Body() createTopicDto: CreateTopicDto) {
  //   return this.topicsService.create(createTopicDto);
  // }

  @Get()
  @Public()
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
  //   return this.topicsService.update(+id, updateTopicDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(+id);
  }
}
