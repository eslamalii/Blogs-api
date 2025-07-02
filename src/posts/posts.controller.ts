import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/CreatePostDto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { PaginationQueryDto } from './dto/PaginationQueryDto';
import { UpdatePostDto } from './dto/UpdatePostDto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() data: CreatePostDto, @CurrentUser() user: User) {
    const post = await this.postsService.create(data, user.id);

    return {
      message: 'Post created successfully',
      data: post,
    };
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const result = await this.postsService.findAll(paginationQuery);

    return {
      message: 'Posts retrieved successfully',
      ...result,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    return {
      message: 'Post retrieved successfully',
      data: post,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePostDto,
    @CurrentUser() user: User,
  ) {
    const post = await this.postsService.update(id, data, user);

    return {
      message: 'Post updated successfully',
      data: post,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    const result = await this.postsService.remove(id, user);
    return result;
  }
}
