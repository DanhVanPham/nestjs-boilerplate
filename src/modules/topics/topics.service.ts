import { Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { Topic } from './entities/topic.entity';

@Injectable()
export class TopicsService extends BaseServiceAbstract<Topic> {}
