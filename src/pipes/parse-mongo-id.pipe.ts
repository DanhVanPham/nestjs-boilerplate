import {
  PipeTransform,
  Logger,
  // ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isObjectIdOrHexString } from 'mongoose';

export class ParseMongoIdPipe implements PipeTransform<string> {
  logger = new Logger(ParseMongoIdPipe.name);
  transform(
    value: string,
    // , metadata: ArgumentMetadata
  ): string {
    // NOTICE: ROUTE PIPE
    this.logger.log('===TRIGGER ROUTE PARAMS PIPE===');
    if (!isObjectIdOrHexString(value))
      throw new BadRequestException('Invalid ID');
    return value;
  }
}
