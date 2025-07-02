import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/CreatePostDto';
import { PaginationQueryDto } from './dto/PaginationQueryDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/constants/UserRole';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  async create(data: CreatePostDto, authorId: number): Promise<Post> {
    const post = this.postRepo.create({
      ...data,
      authorId,
    });

    return this.postRepo.save(post);
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<{
    data: Post[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postRepo.findAndCount({
      relations: ['author'],
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          username: true,
          role: true,
        },
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['author'],
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          username: true,
          role: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, data: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } });

    if (post?.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to update this post',
      );
    }

    await this.postRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const post = await this.findOne(id);

    if (post.authorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepo.delete(id);
    return { message: 'Post deleted successfully' };
  }
}
