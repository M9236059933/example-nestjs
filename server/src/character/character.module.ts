import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './character.entity';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { CharacterGeneratorService } from './character-generator/character-generator.service';
import { World } from '../world/world.entity';
import { CharType } from '../char-type/char-type.entity';
import { Classes } from '../classes/classes.entity';
import { Species } from '../species/species.entity';
import { Gender } from '../gender/gender.entity';
import { Visibility } from '../visibility/visibility.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Character,
      World,
      CharType,
      Classes,
      Species,
      Gender,
      Visibility,
    ]),
  ],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterGeneratorService],
  exports: [CharacterService, CharacterGeneratorService],
})
export class CharacterModule {}
