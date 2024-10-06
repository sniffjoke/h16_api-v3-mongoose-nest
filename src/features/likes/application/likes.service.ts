import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { LikeEntity } from '../domain/likes.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(LikeEntity.name) private userModel: Model<LikeEntity>,
  ) {
  }

}
