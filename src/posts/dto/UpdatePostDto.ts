import { CreatePostDto } from './CreatePostDto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
