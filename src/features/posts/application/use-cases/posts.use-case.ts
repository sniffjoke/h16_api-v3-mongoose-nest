import { Injectable } from '@nestjs/common';
import { PostsService } from '../posts.service';
import { Post } from '../../domain/posts.entity';


@Injectable()
export class PostsUseCase {
  constructor(
    private readonly postsService: PostsService,
  ) {
  }

  async execute(post: Post) {

  }

}
