import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { LikeEntity, LikeSchema } from './domain/likes.entity';
import { LikeHandler } from './domain/like.handler';
import { Post, PostSchema } from '../posts/domain/posts.entity';
import { CommentEntity, CommentSchema } from '../comments/domain/comments.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{
        name: Post.name,
        schema: PostSchema,
    }]),
    MongooseModule.forFeature([{
      name: CommentEntity.name,
      schema: CommentSchema,
    }]),
    MongooseModule.forFeature([{
      name: LikeEntity.name,
      schema: LikeSchema,
    }])
  ],
  controllers: [],
  providers: [
    LikeHandler
  ],
  exports: [
    LikeHandler
  ]
})
export class LikesModule {}
