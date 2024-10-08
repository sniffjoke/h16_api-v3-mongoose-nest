import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../../blogs/domain/blogs.entity';
import { Post } from '../../posts/domain/posts.entity';
import { CommentEntity } from '../../comments/domain/comments.entity';
import { User } from '../../users/domain/users.entity';
import { LikeEntity } from '../../likes/domain/likes.entity';
import { DeviceEntity } from '../../devices/domain/devices.entity';
import { TokenEntity } from '../../tokens/domain/tokens.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(CommentEntity.name) private commentModel: Model<CommentEntity>,
    @InjectModel(LikeEntity.name) private likeModel: Model<LikeEntity>,
    @InjectModel(DeviceEntity.name) private deviceModel: Model<DeviceEntity>,
    @InjectModel(TokenEntity.name) private tokenModel: Model<TokenEntity>,
  ) {
  }

  async deleteAll() {
    const deleteBlogs = await this.blogModel.deleteMany();
    const deletePosts = await this.postModel.deleteMany();
    const deleteUsers = await this.userModel.deleteMany();
    const deleteComments = await this.commentModel.deleteMany();
    const deleteLikes = await this.likeModel.deleteMany();
    const deleteDevices = await this.deviceModel.deleteMany();
    const deleteTokens = await this.tokenModel.deleteMany();
    return {
      deleteBlogs,
      deletePosts,
      deleteUsers,
      deleteComments,
      deleteLikes,
      deleteDevices,
      deleteTokens
    };
  }

}
