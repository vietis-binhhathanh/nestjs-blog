import { IsArray, IsOptional, IsString } from 'class-validator';

class ArticleDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  body: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  @IsArray({ each: true })
  tagList: string[];
}

export class CreateArticleDTO  extends ArticleDTO {}

export class UpdateArticleDTO extends ArticleDTO {}
