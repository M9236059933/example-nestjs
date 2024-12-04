import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from '../character.entity';
import { World } from '../../world/world.entity';
import { CharType } from '../../char-type/char-type.entity';
import { Classes } from '../../classes/classes.entity';
import { Species } from '../../species/species.entity';
import { Gender } from '../../gender/gender.entity';
import { Visibility } from '../../visibility/visibility.entity';
import { User } from '../../user/user.entity';

interface GeneratorData {
  names: string[];
  nicknames: string[];
  hairStyles: string[];
  eyeColors: string[];
  heights: string[];
  appearances: string[];
}

@Injectable()
export class CharacterGeneratorService {
  private generatorData: GeneratorData;

  constructor(
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
    @InjectRepository(World)
    private worldRepository: Repository<World>,
    @InjectRepository(CharType)
    private charTypeRepository: Repository<CharType>,
    @InjectRepository(Classes)
    private classesRepository: Repository<Classes>,
    @InjectRepository(Species)
    private speciesRepository: Repository<Species>,
    @InjectRepository(Gender)
    private genderRepository: Repository<Gender>,
    @InjectRepository(Visibility)
    private visibilityRepository: Repository<Visibility>,
  ) {}

  setGeneratorData(data: GeneratorData) {
    this.generatorData = data;
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  async generateCharacter(userId: number): Promise<Character> {
    if (!this.generatorData) {
      throw new Error('Generator data not initialized');
    }

    const character = new Character();
    
    // Set random values from generator data
    character.name = this.getRandomElement(this.generatorData.names);
    character.nickname = this.getRandomElement(this.generatorData.nicknames);
    character.hair = this.getRandomElement(this.generatorData.hairStyles);
    character.eyes = this.getRandomElement(this.generatorData.eyeColors);
    character.height = this.getRandomElement(this.generatorData.heights);
    character.appearance = this.getRandomElement(this.generatorData.appearances);

    // Get random entities from database
    const [
      world,
      charType,
      class1,
      species,
      gender,
      visibility,
    ] = await Promise.all([
      this.worldRepository.createQueryBuilder()
        .orderBy('RANDOM()')
        .getOne(),
      this.charTypeRepository.createQueryBuilder()
        .orderBy('RANDOM()')
        .getOne(),
      this.classesRepository.createQueryBuilder()
        .orderBy('RANDOM()')
        .getOne(),
      this.speciesRepository.createQueryBuilder()
        .orderBy('RANDOM()')
        .getOne(),
      this.genderRepository.createQueryBuilder()
        .orderBy('RANDOM()')
        .getOne(),
      this.visibilityRepository.createQueryBuilder()
        .orderBy('RANDOM()')
        .getOne(),
    ]);

    character.world = world;
    character.type = charType;
    character.class = class1;
    character.species = species;
    character.gender = gender;
    character.visibility = visibility;
    character.createdBy = { id: userId } as User;

    return this.characterRepository.save(character);
  }
} 