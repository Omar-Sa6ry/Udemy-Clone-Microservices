import { UserEvents } from '@course-plateform/types';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './users.service';
import { UserFacadeService } from './fascade/user.fascade';
import { CreateUserInput } from './inputs/CreateUser.dto';
import { CreateProfileInput } from './inputs/CreateProfile.dto';
import { Role } from '@course-plateform/common';
import { UserProxy } from './proxy/user.proxy';

@Controller()
export class UserNatsController {
  constructor(
    private readonly userFascade: UserFacadeService,
    private readonly userProxy: UserProxy,
    private readonly userService: UserService,
  ) {}

  @MessagePattern('user.exists')
  async handleUserExists(@Payload() data: { id: string }) {
    try {
      const user = await this.userService.findById(data.id);
      return { exists: true, user: user.data };
    } catch {
      return { exists: false };
    }
  }

  @MessagePattern(UserEvents.CREATE_USER_DATA)
  async handleCreateUser(
    @Payload()
    data: {
      createUserInput: CreateUserInput;
      profileInput: CreateProfileInput;
    },
  ) {
    const user = await this.userFascade.create(
      data.createUserInput,
      data.profileInput,
    );
    return { user: user.data };
  }

  @MessagePattern('user.role.updated')
  async handleSaveUser(@Payload() role: Role, @Payload() userId: string) {
    const user = await this.userFascade.saveRole(role, userId);
    return { user: user.data };
  }

  @MessagePattern('user.dataExists')
  async handleUserDataExists(
    @Payload()
    data: {
      email: string;
      phone: string;
      whatsapp: string;
    },
  ) {
    try {
      await this.userService.dataExisted(data.email, data.phone, data.whatsapp);
      return { exists: true };
    } catch {
      return { exists: false };
    }
  }

  @MessagePattern('user.checkIfInstractor')
  async handleInstractorExisted(@Payload() data: { id: string }) {
    try {
      await this.userProxy.checkIfInstractor(data.id);
      return { exists: true };
    } catch {
      return { exists: false };
    }
  }

  @MessagePattern('user.findUsersWithIds')
  async handlefindUsersWithIds(@Payload() data: { ids: string[] }) {
    return await this.userProxy.findUsersWithIds(data.ids);
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

  @MessagePattern(UserEvents.GET_USER_BY_ID)
  async getUserById(@Payload() data: { id: string }) {
    return await this.userService.findById(data.id);
  }

  @MessagePattern(UserEvents.GET_USER_BY_EMAIL)
  async getUserByEmail(@Payload() data: { email: string }) {
    return await this.userService.findByEmail(data.email);
  }

  @MessagePattern(UserEvents.USER_DATA_EXISTED)
  async userDataExists(
    @Payload() data: { email: string; phone: string; whatsapp: string },
  ) {
    return await this.userService.dataExisted(
      data.email,
      data.phone,
      data.whatsapp,
    );
  }

  private mapToUserResponse(user: any) {
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      profile: user.profile
        ? {
            id: user.profile.id,
            bio: user.profile.bio,
            avatar: user.profile.avatar,
            headline: user.profile.headline,
            website_url: user.profile.website_url,
            linkedin_url: user.profile.linkedin_url,
            youtube_url: user.profile.youtube_url,
          }
        : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
