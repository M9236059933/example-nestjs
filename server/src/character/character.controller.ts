import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { Character } from './character.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../user/user.entity';

interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@Controller('character')
@UseGuards(JwtAuthGuard)
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  create(
    @Body() characterData: Partial<Character>,
    @Request() req: RequestWithUser,
  ): Promise<Character> {
    characterData.createdBy = { id: req.user.userId } as User;
    return this.characterService.create(characterData);
  }

  @Get()
  findAll(): Promise<Character[]> {
    return this.characterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Character> {
    return this.characterService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateData: Partial<Character>,
    @Request() req: RequestWithUser,
  ): Promise<Character> {
    return this.characterService.update(id, req.user.userId, updateData);
  }

  @Delete(':id')
  delete(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    return this.characterService.delete(id, req.user.userId);
  }
}
