import { Injectable, NotFoundException } from '@nestjs/common';
import { HydratedDocument, isValidObjectId, Model } from 'mongoose';
import {CommentEntity} from "../domain/comments.entity";
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class CommentsRepository {
    constructor(
      @InjectModel('CommentEntity') private readonly commentModel: Model<CommentEntity>,
    ) {
    }

    async findCommentById(id: string) {
        if (!isValidObjectId(id)) {
            throw new NotFoundException(`Comment with id ${id} not found`);
        }
        const findedComment = this.commentModel.findById(id)
        if (!findedComment) {
            throw new NotFoundException(`Could not find comment with id ${id}`)
        }
        return findedComment
    }

    async saveComment(comment: HydratedDocument<CommentEntity>) {
        const saveComment = await comment.save()
        return saveComment
    }

}
