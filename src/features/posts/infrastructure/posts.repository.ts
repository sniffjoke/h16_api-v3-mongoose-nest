import {Injectable} from "@nestjs/common";
import {HydratedDocument} from "mongoose";
import {Post} from "../domain/posts.entity";


@Injectable()
export class PostsRepository {

    constructor() {}

    async savePost(post: HydratedDocument<Post>) {
        const savePost = await post.save();
        return savePost
    }

   // async getByIdOrThrow(): HydratedDocument<Post> {
//
// }

}
