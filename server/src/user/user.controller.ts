import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateProfileDto } from './update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@Request() req): Promise<User> {
    return this.userService.findOne(req.user.userId);
  }

  @Put('me/profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.userService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Put('me/password')
  async changePassword(
    @Request() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ): Promise<{ message: string }> {
    const success = await this.userService.changePassword(
      req.user.userId,
      body.currentPassword,
      body.newPassword,
    );

    if (!success) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { message: 'Password updated successfully' };
  }
}
