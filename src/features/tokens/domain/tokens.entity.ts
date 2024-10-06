import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({timestamps: {updatedAt: false}, versionKey: false})
export class TokenEntity {

    @Prop({type: mongoose.Types.ObjectId, required: true, default: '2jk32i2ojiso324'})
    userId: string;

    @Prop({type: String, required: true})
    refreshToken: string;
//TODO: iat
    @Prop({type: Boolean, required: true})
    blackList: boolean;

}

export const TokenSchema = SchemaFactory.createForClass(TokenEntity);
