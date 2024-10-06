import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentsController } from "./api/comments.controller";
import { CommentsService } from "./application/comments.service";
import { CommentsRepository } from "./infrastructure/comments.repository";
import { CommentsQueryRepository } from "./infrastructure/comments.query-repository";
import { Post, PostSchema } from "../posts/domain/posts.entity";
import { CommentSchema, CommentEntity } from "./domain/comments.entity";
import { Blog, BlogSchema } from "../blogs/domain/blogs.entity";
import { PostsModule } from "../posts/posts.module";
import { UsersModule } from '../users/users.module';
import { LikesModule } from '../likes/likes.module';
import { TokensService } from '../tokens/application/tokens.service';
import { LikeHandler } from '../likes/domain/like.handler';
import { User, UserSchema } from '../users/domain/users.entity';
import { TokenEntity, TokenSchema } from '../tokens/domain/tokens.entity';
import { LikeEntity, LikeSchema } from '../likes/domain/likes.entity';
import { UsersCheckHandler } from '../users/domain/users.check-handler';
import { UsersRepository } from '../users/infrastructure/users.repository';

@Module({
  imports: [
    forwardRef(() => PostsModule),
    UsersModule,
    LikesModule,
    MongooseModule.forFeature([{
      name: Blog.name,
      schema: BlogSchema
    }]),
    MongooseModule.forFeature([{
      name: Post.name,
      schema: PostSchema
    }]),
    MongooseModule.forFeature([{
      name: CommentEntity.name,
      schema: CommentSchema
    }]),
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    MongooseModule.forFeature([{
      name: TokenEntity.name,
      schema: TokenSchema
    }]),
    MongooseModule.forFeature([{
      name: LikeEntity.name,
      schema: LikeSchema,
    }])
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    TokensService,
    LikeHandler,
    UsersCheckHandler,
    UsersRepository
  ],
  exports: [
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository
  ]
})
export class CommentsModule {
}
