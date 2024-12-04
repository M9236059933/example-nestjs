import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeederService } from './seeds/database-seeder.service';
import { Character } from '../character/character.entity';
import { CharType } from '../char-type/char-type.entity';
import { Classes } from '../classes/classes.entity';
import { Gender } from '../gender/gender.entity';
import { Species } from '../species/species.entity';
import { Visibility } from '../visibility/visibility.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Character, CharType, Classes, Gender, Species, Visibility])],
  providers: [DatabaseSeederService],
  exports: [DatabaseSeederService],
})
export class DatabaseModule {}
