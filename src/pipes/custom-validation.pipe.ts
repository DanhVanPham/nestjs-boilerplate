import { ValidationPipe, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomValidation extends ValidationPipe {
  logger: Logger;

  constructor() {
    super();
    this.logger = new Logger(CustomValidation.name);
  }
  transform(value: any) {
    this.logger.log('===TRIGGER GLOBAL PIPE===');
    return value;
  }
}
