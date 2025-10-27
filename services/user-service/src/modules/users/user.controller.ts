import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.findByEmail')
  async handleFindByEmail(@Payload() data: { email: string }) {
    return await this.userService.findByEmail(data.email);
  }

  @MessagePattern('user.findById')
  async handleFindById(@Payload() data: { id: string }) {
    return await this.userService.findById(data.id);
  }

  @MessagePattern('user.exists')
  async handleUserExists(@Payload() data: { id: string }) {
    try {
      const user = await this.userService.findById(data.id);
      return { exists: true, user: user.data };
    } catch {
      return { exists: false };
    }
  }

  @MessagePattern('user.update_user')
  async handleUpdateUser(@Payload() data: { id: string; updates: any }) {
    return await this.userService.updateUser(data.updates, data.id);
  }

  @MessagePattern('user.update_profile')
  async handleUpdateProfile(@Payload() data: { id: string; updates: any }) {
    return await this.userService.updateProfile(data.updates, data.id);
  }

  @MessagePattern('user.delete')
  async handleDeleteUser(@Payload() data: { id: string }) {
    return await this.userService.delete(data.id);
  }

  @MessagePattern('user.get_instructors')
  async handleGetInstructors(
    @Payload() data: { page?: number; limit?: number },
  ) {
    return await this.userService.findInstructors(data.page, data.limit);
  }
}
