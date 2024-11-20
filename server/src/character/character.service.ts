import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './character.entity';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
  ) {}

  async create(characterData: Partial<Character>): Promise<Character> {
    const character = this.characterRepository.create(characterData);
    return this.characterRepository.save(character);
  }

  async findAll(): Promise<Character[]> {
    return this.characterRepository.find({
      relations: [
        'world',
        'type',
        'class',
        'secondClass',
        'species',
        'gender',
        'visibility',
        'createdBy',
        'owner',
      ],
    });
  }

  async findOne(id: number): Promise<Character> {
    const character = await this.characterRepository.findOne({
      where: { id },
      relations: [
        'world',
        'type',
        'class',
        'secondClass',
        'species',
        'gender',
        'visibility',
        'createdBy',
        'owner',
      ],
    });
    if (!character) {
      throw new NotFoundException('Character not found');
    }
    return character;
  }

  async update(id: number, userId: number, updateData: Partial<Character>): Promise<Character> {
    const character = await this.findOne(id);
    
    if (character.createdBy?.id !== userId) {
      throw new ForbiddenException('You do not have permission to edit this character');
    }

    await this.characterRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: number, userId: number): Promise<void> {
    const character = await this.findOne(id);
    
    if (character.createdBy?.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this character');
    }

    const result = await this.characterRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Character not found');
    }
  }
}
