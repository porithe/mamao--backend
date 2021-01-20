import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../constants/user';

@Controller('v1')
export class UserController {}
