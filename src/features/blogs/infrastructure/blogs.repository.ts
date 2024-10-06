import { BadRequestException, Injectable } from '@nestjs/common';
import {Blog} from "../domain/blogs.entity";
import { HydratedDocument, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


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
        const findedBlog = await this.blogModel.findById(id)
        if (!findedBlog) {
            throw new BadRequestException("Blog not found")
        }
        return findedBlog
    }


}
