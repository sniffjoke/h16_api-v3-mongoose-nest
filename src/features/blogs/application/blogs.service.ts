import {Injectable, NotFoundException} from '@nestjs/common';
import {BlogsRepository} from "../infrastructure/blogs.repository";
import {Blog} from "../domain/blogs.entity";
import {Model, UpdateWriteOpResult} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {BlogCreateModel} from "../api/models/input/create-blog.input.model";

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel(Blog.name) private blogModel: Model<Blog>,
        private readonly blogsRepository: BlogsRepository
    ) {
    }

    async createBlog(blog: BlogCreateModel): Promise<string> {
        const newBlog = new this.blogModel(blog)
        const saveData = await this.blogsRepository.saveBlog(newBlog)
        return saveData._id.toString()
    }

    async updateBlog(id: string, dto: BlogCreateModel): Promise<UpdateWriteOpResult> {
        const blog = await this.blogModel.findById(id)
        if (!blog) {
            throw new NotFoundException(`Blog with id ${id} not found`)
        }
        const updateBlog = await this.blogModel.updateOne({_id: blog._id}, {$set: {...dto}})
        return updateBlog
    }

    async deleteBlog(id: string) {
        const findedBlog = await this.blogModel.findById(id)
        if (!findedBlog) {
            throw new NotFoundException(`Blog with id ${id} not found`)
        }
        const deleteBlog = await this.blogModel.deleteOne({_id: id})
        return deleteBlog
    }

    async findBlogById(id: string) {
        const findedBlog = await this.blogModel.findById(id)
        if (!findedBlog) {
            throw new NotFoundException(`Blog with id ${id} not found`)
        }
        return findedBlog
    }

}
