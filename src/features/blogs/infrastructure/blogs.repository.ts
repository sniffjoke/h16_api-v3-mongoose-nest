import { Injectable } from '@nestjs/common';
import {Blog} from "../domain/blogs.entity";
import { HydratedDocument, Model, UpdateWriteOpResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlogCreateModel } from '../api/models/input/create-blog.input.model';


@Injectable()
export class BlogsRepository {
    constructor(
      @InjectModel("Blog") private readonly blogModel: Model<Blog>,
    ) {
    }

    async saveBlog(blog: HydratedDocument<Blog>) {
        const saveBlog = await blog.save()
        return saveBlog
    }

    async findBlogById(id: string) {
        const findedBlog = await this.blogModel.findOne({_id: id})
        return findedBlog
    }

    async updateBlogById(id: string, dto: BlogCreateModel): Promise<UpdateWriteOpResult> {
        const updateBlog = await this.blogModel.updateOne({_id: id}, {$set: {...dto}})
        return updateBlog
    }

    async deleteBlog(id: string) {
        const deleteBlog = await this.blogModel.deleteOne({_id: id})
        return deleteBlog
    }
}
