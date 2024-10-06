import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";
import { CommentatorInfoModel } from "../api/models/output/comment.view.model";

@Schema({timestamps: false, _id: false})
export class CommentatorInfoEntity {
    @Prop({type: String, required: true})
    userId: string;

    @Prop({type: String, required: true})
    userLogin: string;

}

@Schema({timestamps: false, _id: false})
export class LikesInfo {
    @Prop({type: Number, required: true, default: 0})
    likesCount: number;

    @Prop({type: Number, required: true, default: 0})
    dislikesCount: number;

    // @Prop({type: String, enum: LikeStatus, required: true, default: LikeStatus.None})
    // myStatus: string;

}


@Schema({timestamps: {updatedAt: false}, versionKey: false})
export class CommentEntity {
    @Prop({type: String, required: true})
    content: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Post'})
    postId: string

    @Prop({type: CommentatorInfoEntity, required: true, default: new CommentatorInfoEntity()})
    commentatorInfo: CommentatorInfoModel;

    @Prop({type: LikesInfo, required: true, default: new LikesInfo})
    likesInfo: LikesInfo;

}

export const CommentSchema = SchemaFactory.createForClass(CommentEntity);
