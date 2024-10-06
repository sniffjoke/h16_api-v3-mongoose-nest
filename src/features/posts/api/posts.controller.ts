import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { PostCreateModel } from './models/input/create-post.input.model';
import { PostsService } from '../application/posts.service';
import { PostViewModel } from './models/output/post.view.model';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { UpdateWriteOpResult } from 'mongoose';
import { CommentCreateModel } from '../../comments/api/models/input/create-comment.input.model';
import { CommentsService } from '../../comments/application/comments.service';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query-repository';
import { BasicAuthGuard } from '../../../core/guards/basic-auth.guard';
import { Request } from 'express';
import { LikeHandler } from '../../likes/domain/like.handler';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CreateLikeInput } from '../../likes/api/models/input/create-like.input.model';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly likeHandler: LikeHandler,
  ) {

  }

  @Get()
  async getAllPosts(@Query() query: any, @Req() req: Request) {
    const posts = await this.postsQueryRepository.getAllPostsWithQuery(query);
    const newData = await this.postsService.generatePostsWithLikesDetails(posts.items, req.headers.authorization as string)
    return {
      ...posts,
      items: newData
    };
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createPost(@Body() dto: PostCreateModel, @Req() req: Request) {
    const postId = await this.postsService.createPost(dto);
    const newPost = await this.postsQueryRepository.postOutput(postId);
    const postWithDetails = await this.postsService.generateOnePostWithLikesDetails(newPost, req.headers.authorization as string)
    return postWithDetails;
    // return newPost;
  }

  @Get(':id')
  async getPostById(@Param('id') id: string, @Req() req: Request): Promise<PostViewModel> {
    const post = await this.postsQueryRepository.postOutput(id);
    const postWithDetails = await this.postsService.generateOnePostWithLikesDetails(post, req.headers.authorization as string)
    return postWithDetails;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updatePostById(@Param('id') id: string, @Body() dto: PostCreateModel): Promise<UpdateWriteOpResult> {
    const updatePost = await this.postsService.updatePost(id, dto);
    return updatePost;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deletePost(@Param('id') id: string) {
    const deletePost = await this.postsService.deletePost(id);
    return deletePost;
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async createComment(@Body() dto: CommentCreateModel, @Param('id') id: string, @Req() req: Request) {
    const commentId = await this.commentsService.createComment(dto, id, req.headers.authorization as string);
    const newComment = await this.commentsQueryRepository.commentOutput(commentId);
    const newCommentData = this.commentsService.addStatusPayload(newComment)
    return newCommentData;
  }

  @Get(':id/comments')
  async getAllCommentsByPostId(@Param('id') id: string, @Query() query: any, @Req() req: Request) {
    // const comments = await this.commentsQueryRepository.getAllCommentsByPostId(id);
    const comments = await this.commentsQueryRepository.getAllCommentByPostIdWithQuery(query, id);
    const commentsMap = await this.commentsService.generateCommentsData(comments.items, req.headers.authorization as string)
    return {
      ...comments,
      items: commentsMap
    }
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updatePostByIdWithLikeStatus(@Body() like: CreateLikeInput, @Param('id') postId: string, @Req() req: Request) {
    const { findedPost, user} = await this.postsService.updatePostByIdWithLikeStatus(req.headers.authorization as string, postId);
    return await this.likeHandler.postHandler(req.body.likeStatus, findedPost!, user!);
  }

}
