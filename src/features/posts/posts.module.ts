import { forwardRef, Module } from "@nestjs/common";
import { PostsController } from "./api/posts.controller";
import { PostsService } from "./application/posts.service";
import { PostsRepository } from "./infrastructure/posts.repository";
import { PostsQueryRepository } from "./infrastructure/posts.query-repository";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./domain/posts.entity";
import { Blog, BlogSchema } from "../blogs/domain/blogs.entity";
import { CommentEntity, CommentSchema } from "../comments/domain/comments.entity";
import { BlogsModule } from "../blogs/blogs.module";
import { CommentsModule } from "../comments/comments.module";
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/domain/users.entity';
import { LikesModule } from '../likes/likes.module';
import { LikeEntity, LikeSchema } from '../likes/domain/likes.entity';
import { TokensService } from '../tokens/application/tokens.service';
import { TokenEntity, TokenSchema } from '../tokens/domain/tokens.entity';
import { LikeHandler } from '../likes/domain/like.handler';

@Module({
  imports: [
    forwardRef(() => BlogsModule),
    CommentsModule,
    UsersModule,
    LikesModule,
    MongooseModule.forFeature([{
      name: Post.name,
      schema: PostSchema
    }]),
    MongooseModule.forFeature([{
      name: Blog.name,
      schema: BlogSchema
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
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    TokensService,
    LikeHandler
  ],
  exports: [
    forwardRef(() => BlogsModule),
    PostsService,
    PostsRepository,
    PostsQueryRepository
  ],
})
export class PostsModule {
}
