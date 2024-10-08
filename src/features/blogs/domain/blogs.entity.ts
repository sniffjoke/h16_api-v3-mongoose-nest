import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

// loadClass mongoose

export type BlogDocument = Blog & HydratedDocument<Blog>;

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

    // updateBlog(dto: any, userId: string) {
    //     if(userId !== this.authorId) throw new ForbiddenException('')
    //     this.name = dto.name
    //     //..
    // }
    //
    // static creatBlog(dto: any): BlogDocument {
    //     const blog = new this();
    //     blog.name = dto.name;
    //     //..
    //
    //     return blog as BlogDocument
    // }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
// BlogSchema.loadClass(Blog)

// export type BlogModel  = Model<BlogDocument> & typeof Blog;

