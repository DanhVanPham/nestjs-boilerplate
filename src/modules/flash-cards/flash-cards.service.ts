import { Injectable } from '@nestjs/common';

@Injectable()
export class FlashCardsService {
  findAll() {
    return `This action returns all flashCards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flashCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} flashCard`;
  }
}
