import {
  ValidationPipe,
  Injectable,
  Logger,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class CustomValidation extends ValidationPipe {
  logger: Logger;

  constructor() {
    super();
    this.logger = new Logger(CustomValidation.name);
  }
  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.log('===TRIGGER GLOBAL PIPE===');
    return value;
  }
}
