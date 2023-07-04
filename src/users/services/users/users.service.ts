import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post.entitie';
import { Profile } from 'src/typeorm/entities/Profile.entitie';
import { User } from 'src/typeorm/entities/User.entitie';
import {
  CreateUserParams,
  CreateUserPostParams,
  CreateUserProfileParams,
  UpdateUserParams,
} from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Post) private readonly postRepositore: Repository<Post>,
  ) {}

  findUsers() {
    return this.userRepository.find({ relations: ['profile', 'posts'] });
  }

  createUser(userDetais: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetais,
      createAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }

  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async createUserProfile(
    id: number,
    createUserProfile: CreateUserProfileParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        'Usuário não encontrado. Profile não criado!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newProfile = this.profileRepository.create(createUserProfile);
    const saveProfile = await this.profileRepository.save(newProfile);
    user.profile = saveProfile;
    return this.userRepository.save(user);
  }

  async createUserPost(
    id: number,
    createUserPostDetails: CreateUserPostParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        'Usuário não encontrado. Post não criado!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newPost = this.postRepositore.create({
      ...createUserPostDetails,
      user: user,
    });
    return await this.postRepositore.save(newPost);
  }
}
