import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { FollowerService } from '../follower/follower.service';

@Module({
  providers: [UserService, PrismaService, FollowerService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
