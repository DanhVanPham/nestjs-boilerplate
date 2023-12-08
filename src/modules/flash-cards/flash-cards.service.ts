import { Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { FlashCard } from './entities/flash-card.entity';

@Injectable()
export class FlashCardsService extends BaseServiceAbstract<FlashCard> {}
