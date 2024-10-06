import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import { EmailConfirmationModel } from "../api/models/input/create-user.input.model";

@Schema({timestamps: false, _id: false})
class EmailConfirmationInfo {
    @Prop({type: String})
    confirmationCode?: string
    @Prop({type: String})
    expirationDate?: string
    @Prop({type: Boolean, required: true})
    isConfirmed: boolean
}


@Schema({timestamps: {updatedAt: false}, versionKey: false})
export class User {

    @Prop({type: String, required: true})
    login: string;

    @Prop({type: String, required: true})
    email: string;

    @Prop({type: String, required: true})
    password: string;

    @Prop({type: EmailConfirmationInfo, required: true})
    emailConfirmation: EmailConfirmationModel;

}

export const UserSchema = SchemaFactory.createForClass(User);
