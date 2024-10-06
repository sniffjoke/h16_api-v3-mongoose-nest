import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model, UpdateWriteOpResult } from 'mongoose';
import {Post} from "../domain/posts.entity";
import { InjectModel } from '@nestjs/mongoose';
import { PostCreateModel } from '../api/models/input/create-post.input.model';


@Injectable()
export class PostsRepository {

    constructor(
      @InjectModel('Post') private readonly postModel: Model<Post>,
    ) {
    }

    async savePost(post: HydratedDocument<Post>) {
        const savePost = await post.save();
        return savePost
    }

    async findPostById(id: string) {
        const findedPost = await this.postModel.findById(id)
        return findedPost
    }

    async updatePost(id: string, dto: PostCreateModel): Promise<UpdateWriteOpResult> {
        const updatePost = await this.postModel.updateOne({_id: id}, {$set: {...dto}})
        return updatePost
    }

   // async getByIdOrThrow(): HydratedDocument<Post> {
//
// }

}
