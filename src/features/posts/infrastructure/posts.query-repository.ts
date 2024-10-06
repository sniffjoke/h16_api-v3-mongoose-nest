import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Post} from "../domain/posts.entity";
import {HydratedDocument, Model} from "mongoose";
import {PostViewModel} from "../api/models/output/post.view.model";
import {Blog} from "../../blogs/domain/blogs.entity";
import {PaginationBaseModel} from "../../../core/base/pagination.base.model";


@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(Post.name) private readonly postModel: Model<Post>,
        @InjectModel(Blog.name) private readonly blogModel: Model<Blog>
    ) {
    }

    async getAllPosts(): Promise<PostViewModel[]> {
        const posts = await this.postModel.find()
        return posts.map(post => this.postOutputMap(post as HydratedDocument<PostViewModel>))
    }
    //
    // async getAllPostsByBlogId(blogId: string): Promise<PostViewModel[]> {
    //     const blog = await this.blogModel.findById(blogId)
    //     if (!blog) {
    //         throw new NotFoundException("Blog not found")
    //     }
    //     const posts = await this.postModel.find({blogId})
    //     return posts.map(post => this.postOutputMap(post as HydratedDocument<PostViewModel>))
    // }

    async getAllPostsWithQuery(query: any, blogId?: string): Promise<PaginationBaseModel<PostViewModel>> {
        const generateQuery = await this.generateQuery(query, blogId)
        if (blogId) {
            const blog = await this.blogModel.findById(blogId)
            if (!blog) {
                throw new NotFoundException("Blog not found")
            }
        }
        const blogIdFilter = blogId ? {blogId} : {}
        const items = await this.postModel
            .find(blogIdFilter)
            .sort({[generateQuery.sortBy]: generateQuery.sortDirection})
            .limit(generateQuery.pageSize)
            .skip((generateQuery.page - 1) * generateQuery.pageSize)
        const itemsOutput = items.map(item => this.postOutputMap(item as HydratedDocument<PostViewModel>))
        const resultPosts = new PaginationBaseModel<PostViewModel>(generateQuery, itemsOutput)
        return resultPosts
    }

    private async generateQuery(query: any, blogId?: string) {
        const blogIdFilter = blogId ? {blogId} : {}
        const totalCount = await this.postModel.countDocuments(blogIdFilter)
        const pageSize = query.pageSize ? +query.pageSize : 10
        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            totalCount,
            pageSize,
            pagesCount,
            page: query.pageNumber ? Number(query.pageNumber) : 1,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection : 'desc',
        }
    }

    async postOutput(id: string): Promise<PostViewModel> {
        const post = await this.postModel.findById(id)
        if (!post) {
            throw new NotFoundException("Post not found")
        }
        return this.postOutputMap(post as HydratedDocument<PostViewModel>)
    }

    postOutputMap(post: HydratedDocument<PostViewModel>): PostViewModel {
        const {_id, title, shortDescription, content, extendedLikesInfo, blogId, blogName, createdAt} = post
        return {
            id: _id.toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            extendedLikesInfo: {
                likesCount: extendedLikesInfo.likesCount,
                dislikesCount: extendedLikesInfo.dislikesCount,
                newestLikes: extendedLikesInfo.newestLikes
            },
            createdAt
        }
    }

}
