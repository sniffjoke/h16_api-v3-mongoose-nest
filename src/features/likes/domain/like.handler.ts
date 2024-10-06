import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LikeEntity } from './likes.entity';
import { HydratedDocument, Model } from 'mongoose';
import { Post } from '../../posts/domain/posts.entity';
import { User } from '../../users/domain/users.entity';
import { LikeStatus } from '../../posts/api/models/output/post.view.model';
import { CommentEntity } from '../../comments/domain/comments.entity';


@Injectable()
export class LikeHandler {
  constructor(
    @InjectModel(LikeEntity.name) private likeModel: Model<LikeEntity>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(CommentEntity.name) private commentModel: Model<CommentEntity>,
  ) {
  }

  async postHandler(likeStatus: string, post: HydratedDocument<Post>, user: HydratedDocument<User>) {
    const isLikeObjectForCurrentUserExists: HydratedDocument<LikeEntity> | null = await this.likeModel.findOne({
      userId: user._id,
      postId: post._id,
    });
    if (isLikeObjectForCurrentUserExists === null) {
      const newLike = await this.likeModel.create({
        status: LikeStatus.None,
        userId: user._id,
        postId: post._id,
      });
    }
    const findedLike: HydratedDocument<LikeEntity> | null = await this.likeModel.findOne({
      userId: user._id,
      postId: post._id,
    }); // Пессимистическая блокировка
    if (findedLike?.status === likeStatus) {
      const updateLikeStatus = null;
    } else {
      const updateLikeStatus = await this.likeModel.findByIdAndUpdate(findedLike?._id, { status: likeStatus });
      const dislikeCount = post.extendedLikesInfo.dislikesCount;
      const likeCount = post.extendedLikesInfo.likesCount;
      if (likeStatus === LikeStatus.Like) {
        if (dislikeCount > 0 && findedLike?.status === LikeStatus.Dislike) {
          const updatePostInfo = await this.postModel.updateOne({ _id: post._id }, {
            $inc: {
              'extendedLikesInfo.likesCount': +1,
              'extendedLikesInfo.dislikesCount': -1,
            },
          });
        } else {
          const updatePostInfo = await this.postModel.updateOne({ _id: post._id }, { $inc: { 'extendedLikesInfo.likesCount': +1 } });
        }
      }
      if (likeStatus === LikeStatus.Dislike) {
        if (likeCount > 0 && findedLike?.status === LikeStatus.Like) {
          const updatePostInfo = await this.postModel.updateOne({ _id: post._id }, {
            $inc: {
              'extendedLikesInfo.likesCount': -1,
              'extendedLikesInfo.dislikesCount': +1,
            },
          });
        } else {
          const updatePostInfo = await this.postModel.updateOne({ _id: post._id }, { $inc: { 'extendedLikesInfo.dislikesCount': +1 } });
        }
      }
      if (likeStatus === LikeStatus.None) {
        if (findedLike?.status === LikeStatus.Like) {
          const updatePostInfo = await this.postModel.updateOne({ _id: post._id }, { $inc: { 'extendedLikesInfo.likesCount': -1 } });
        } else {
          const updatePostInfo = await this.postModel.updateOne({ _id: post._id }, { $inc: { 'extendedLikesInfo.dislikesCount': -1 } });
        }
      }
    }
  }

  async commentHandler(likeStatus: string, comment: HydratedDocument<CommentEntity>, user: HydratedDocument<User>) {
    const isLikeObjectForCurrentUserExists: HydratedDocument<LikeEntity> | null = await this.likeModel.findOne({
      userId: user._id,
      commentsId: comment._id
    });
    if (isLikeObjectForCurrentUserExists === null) {
      const newLike = await this.likeModel.create({
        status: LikeStatus.None,
        userId: user._id,
        commentId: comment._id,
      })
    }
    const findedLike: HydratedDocument<LikeEntity> | null = await this.likeModel.findOne({userId: user._id, commentId: comment._id})
    if (findedLike?.status === likeStatus) {
      const updateLikeStatus = null
    } else {
      const updateLikeStatus = await this.likeModel.findByIdAndUpdate(findedLike?._id, {status: likeStatus});
      const dislikeCount = comment.likesInfo.dislikesCount
      const likeCount = comment.likesInfo.likesCount
      if (likeStatus === LikeStatus.Like) {
        if (dislikeCount > 0 && findedLike?.status === LikeStatus.Dislike) {
          const updateCommentInfo = await this.commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.likesCount': +1, 'likesInfo.dislikesCount': -1}})
        } else {
          const updateCommentInfo = await this.commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.likesCount': +1}})
        }
      }
      if (likeStatus === LikeStatus.Dislike) {
        if (likeCount > 0 && findedLike?.status === LikeStatus.Like) {
          const updateCommentInfo = await this.commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.likesCount': -1, 'likesInfo.dislikesCount': +1}})
        } else {
          const updateCommentInfo = await this.commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.dislikesCount': +1}})
        }
      }
      if (likeStatus === LikeStatus.None) {
        if (findedLike?.status === LikeStatus.Like) {
          const updateCommentInfo = await this.commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.likesCount': -1}})
        } else {
          const updateCommentInfo = await this.commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.dislikesCount': -1}})
        }
      }
    }


  }

}
