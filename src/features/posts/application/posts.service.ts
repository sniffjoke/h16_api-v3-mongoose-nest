import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Post} from "../domain/posts.entity";
import { HydratedDocument, Model, UpdateWriteOpResult } from 'mongoose';
import {PostsRepository} from "../infrastructure/posts.repository";
import { PostCreateModel, PostCreateModelWithParams } from '../api/models/input/create-post.input.model';
import {BlogsService} from "../../blogs/application/blogs.service";
import { User } from '../../users/domain/users.entity';
import { TokensService } from '../../tokens/application/tokens.service';
import { LikeStatus, PostViewModel } from '../api/models/output/post.view.model';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { LikeEntity } from '../../likes/domain/likes.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel('Post') private readonly postModel: Model<Post>,
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('LikeEntity') private readonly likeModel: Model<LikeEntity>,
        private readonly postsRepository: PostsRepository,
        private readonly blogsService: BlogsService,
        private readonly tokensService: TokensService,
        private readonly usersRepository: UsersRepository,
    ) {
    }

    async createPost(post: PostCreateModel): Promise<string> {
        const findedBlog = await this.blogsService.findBlogById(post.blogId)
        const newPost = new this.postModel({...post, blogName: findedBlog?.name})
        const saveData = await this.postsRepository.savePost(newPost)
        return saveData._id.toString()
    }

    async createPostWithParams(post: PostCreateModelWithParams, blogId: string): Promise<string> {
        const findedBlog = await this.blogsService.findBlogById(blogId)
        console.log(post);
        const newPost = new this.postModel({...post, blogName: findedBlog?.name, blogId: findedBlog?.id})
        const saveData = await this.postsRepository.savePost(newPost)
        return saveData._id.toString()
    }

    async updatePost(id: string, dto: PostCreateModel): Promise<UpdateWriteOpResult> {
        const post = await this.postModel.findById(id)
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`)
        }
        const updatePost = await this.postModel.updateOne({_id: post._id}, {$set: {...dto}})
        return updatePost
    }

    async deletePost(id: string) {
        const findedPost = await this.postModel.findById(id)
        if (!findedPost) {
            throw new NotFoundException(`Post with id ${id} not found`)
        }
        const deletePost = await this.postModel.deleteOne({_id: id})
        return deletePost
    }

    async findPostById(id: string) {
        const findedPost = await this.postModel.findById(id)
        if (!findedPost) {
            throw new NotFoundException(`Post with id ${id} not found`)
        }
        return findedPost
    }

    async updatePostByIdWithLikeStatus(bearerHeader: string, postId: string) {
        const token = this.tokensService.getToken(bearerHeader);
        const decodedToken: any = this.tokensService.decodeToken(token);
        const user: HydratedDocument<User> | null = await this.userModel.findById(decodedToken?._id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const findedPost = await this.postModel.findById(postId);
        if (!findedPost) {
            throw new NotFoundException(`Post with id ${postId} not found`)
        }
        return {
            findedPost,
            user
        }
    }

    async generatePostsWithLikesDetails(items: PostCreateModel[], bearerToken: string) {
        const newItems = await Promise.all(
          items.map(async (item) => {
                return this.generateOnePostWithLikesDetails(item, bearerToken)
            }
          )
        )
        return newItems
    }

    async generateOnePostWithLikesDetails(post: any , bearerHeader: string) {
        const isUserExists = await this.usersRepository.findUserByToken(bearerHeader)
        const likeStatus = await this.likeModel.findOne({userId: isUserExists?._id, postId: post.id})
        const likeDetails = await this.likeModel.find({
            postId: post.id,
            status: LikeStatus.Like
        })
          .limit(3)
          .sort({createdAt: -1})
        const likeDetailsMap = await Promise.all(
          likeDetails.map(async (like: any) => {
              const user = await this.userModel.findById(like.userId)
              return {
                  addedAt: like.createdAt.toISOString(),
                  userId: like.userId,
                  login: user!.login
              }
          })
        )
        const myStatus = isUserExists && likeStatus ? likeStatus?.status : LikeStatus.None
        const postDataWithInfo = this.statusAndNewLikesPayload(post, myStatus, likeDetailsMap)
        return postDataWithInfo
    }

    statusAndNewLikesPayload(post: PostViewModel, status?: string, newestLikes?: any) {
        const newStatus = status ? status : LikeStatus.None
        const newLikes = newestLikes ? newestLikes : []
        return {
            ...post,
            extendedLikesInfo: {
                ...post.extendedLikesInfo,
                myStatus: newStatus,
                newestLikes: newLikes
            }
        }
    }

}
