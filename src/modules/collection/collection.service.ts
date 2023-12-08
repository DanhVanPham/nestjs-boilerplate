import { Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { Collection } from './entities/collection.entity';
@Injectable()
export class CollectionService extends BaseServiceAbstract<Collection> {}
