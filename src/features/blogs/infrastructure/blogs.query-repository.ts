import {Injectable, NotFoundException} from "@nestjs/common";
import {Blog} from "../domain/blogs.entity";
import {HydratedDocument, Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {BlogViewModel} from "../api/models/output/blog.view.model";
import {PaginationBaseModel} from "../../../core/base/pagination.base.model";


@Injectable()
export class BlogsQueryRepository {
    constructor(
        @InjectModel(Blog.name) private readonly blogModel: Model<Blog>
    ) {
    }

    // async getAllBlogs(query: any): Promise<BlogViewModel[]> {
    //     const blogs = await this.blogModel.find()
    //     return blogs.map(blog => this.blogOutputMap(blog as HydratedDocument<BlogViewModel>))
    // }

    async getAllBlogsWithQuery(query: any) {
        const generateQuery = await this.generateQuery(query)
        const items = await this.blogModel
            .find(generateQuery.filterName)
            .sort({[generateQuery.sortBy]: generateQuery.sortDirection})
            .limit(generateQuery.pageSize)
            .skip((generateQuery.page - 1) * generateQuery.pageSize)
        const itemsOutput = items.map(item => this.blogOutputMap(item as HydratedDocument<BlogViewModel>))
        const resultBlogs = new PaginationBaseModel<BlogViewModel>(generateQuery, itemsOutput)
        return resultBlogs
    }

    private async generateQuery(query: any) {
        const queryName: string = query.searchNameTerm ? query.searchNameTerm : ''
        const filterName = {name: {$regex: queryName, $options: "i"}}
        const totalCount = await this.blogModel.countDocuments(filterName)
        const pageSize = query.pageSize ? +query.pageSize : 10
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            totalCount,
            pageSize,
            pagesCount,
            page: query.pageNumber ? Number(query.pageNumber) : 1,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection : 'desc',
            queryName,
            filterName
        }
    }

    async blogOutput(id: string): Promise<BlogViewModel> {
        const blog = await this.blogModel.findById(id)
        if (!blog) {
            throw new NotFoundException(`Blog with id ${id} not found`)
        }
        return this.blogOutputMap(blog as HydratedDocument<BlogViewModel>)
    }

    blogOutputMap(blog: HydratedDocument<BlogViewModel>): BlogViewModel {
        const {_id, name, description, websiteUrl, isMembership, createdAt} = blog
        return {
            id: _id.toString(),
            name,
            description,
            websiteUrl,
            createdAt,
            isMembership
        }
    }

}
