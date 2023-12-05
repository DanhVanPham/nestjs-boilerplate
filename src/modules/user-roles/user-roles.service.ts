import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRolesService {
  findAll() {
    return `This action returns all userRoles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} userRole`;
  }
}
