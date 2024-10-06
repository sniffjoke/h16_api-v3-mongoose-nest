import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";

class BaseEntity {
    createdAt: Date
}

@Schema({timestamps: false, _id: false})
export class NewestLikes {
    @Prop({type: String})
    addedAt: string

    @Prop({type: String})
    userId: string

    @Prop({type: String})
    login: string
}

@Schema({timestamps: false, _id: false})
export class ExtendedLikesInfo {
    @Prop({type: Number, default: 0})
    likesCount: number;

    @Prop({type: Number, default: 0})
    dislikesCount: number;

    @Prop({type: [NewestLikes], required: true, default: []})
    newestLikes: NewestLikes[]
}


@Schema({timestamps: {updatedAt: false}, versionKey: false})
export class Post {
    @Prop({type: String, required: true})
    title: string;

    @Prop({type: String, required: true})
    shortDescription: string;

    @Prop({type: String, required: true})
    content: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Blog'})
    blogId: string

    @Prop({type: String, required: true})
    blogName: string;

    @Prop({type: ExtendedLikesInfo, default: new ExtendedLikesInfo})
    extendedLikesInfo: ExtendedLikesInfo;

}

export const PostSchema = SchemaFactory.createForClass(Post);
