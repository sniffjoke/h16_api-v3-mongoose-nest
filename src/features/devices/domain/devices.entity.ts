import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({timestamps: {updatedAt: false}, versionKey: false})
export class DeviceEntity {

    @Prop({type: mongoose.Types.ObjectId, required: true})
    userId: string;

    @Prop({type: String, required: true})
    deviceId: string;

    @Prop({type: String, required: true})
    ip: string;

    @Prop({type: String, required: true})
    title: string;

    @Prop({type: String, required: true})
    lastActiveDate: string;

}

export const DeviceSchema = SchemaFactory.createForClass(DeviceEntity);
