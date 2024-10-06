import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";
import { LikeStatus } from '../../posts/api/models/output/post.view.model';


@Schema({timestamps: {updatedAt: false}, versionKey: false})
export class LikeEntity {

    @Prop({type: mongoose.Types.ObjectId, required: true, default: '2jk32i2ojiso324'})
    userId: string;

    @Prop({type: String})
    postId: string;

    @Prop({type: String})
    commentId: string;

    @Prop({type: String, enum: LikeStatus, required: true, default: LikeStatus.None})
    status: string;

}

export const LikeSchema = SchemaFactory.createForClass(LikeEntity);
