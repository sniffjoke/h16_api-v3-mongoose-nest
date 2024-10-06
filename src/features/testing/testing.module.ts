import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {TestingController} from "./api/testing.controller";
import {TestingService} from "./application/testing.service";
import {Blog, BlogSchema} from "../blogs/domain/blogs.entity";
import {Post, PostSchema} from "../posts/domain/posts.entity";
import {CommentEntity, CommentSchema} from "../comments/domain/comments.entity";
import {User, UserSchema} from "../users/domain/users.entity";
import { LikeEntity, LikeSchema } from '../likes/domain/likes.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Blog.name,
            schema: BlogSchema,
        }]),
        MongooseModule.forFeature([{
            name: Post.name,
            schema: PostSchema,
        }]),
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema,
        }]),
        MongooseModule.forFeature([{
            name: CommentEntity.name,
            schema: CommentSchema,
        }]),
        MongooseModule.forFeature([{
            name: LikeEntity.name,
            schema: LikeSchema,
        }]),
    ],
    controllers: [TestingController],
    providers: [
        TestingService,
    ],
})
export class TestingModule {
}
