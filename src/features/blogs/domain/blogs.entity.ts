import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


@Schema({timestamps: {updatedAt: false}, versionKey: false})
export class Blog {
    @Prop({type: String, required: true})
    name: string;

    @Prop({type: String, required: true})
    description: string;

    @Prop({type: String, required: true})
    websiteUrl: string;

    @Prop({type: Boolean, required: true, default: false})
    isMembership: boolean
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
