import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../entities/user.entity';
import { User } from '../auth/user.decorator';
import { CreateArticleDTO, UpdateArticleDTO } from '../models/article.models';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {
  }

  @Get('/:slug')
  @UseGuards(AuthGuard())
  async findBySlug(@Param('slug') slug: string, @User() user: UserEntity) {
    const article = await this.articleService.findBySlug(slug);
    return { article: article.toArticle() };
  }

  @Post('/:slug')
  @UseGuards(AuthGuard())
  async createArticle(@User() user: UserEntity, @Body(ValidationPipe) data: { article: CreateArticleDTO }) {
    const article = await this.articleService.createArticle(user, data.article);

    return article.toArticle(user);
  }

  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    @Param('slug') slug: string,
    @User() user: UserEntity,
    @Body(ValidationPipe) data: { article: UpdateArticleDTO },
  ) {
    const article = await this.articleService.updateArticle(slug, user, data.article);

    return article.toArticle(user);
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(
    @Param() slug: string,
    @User() user: UserEntity,
  ) {
    const article = await this.articleService.deleteArticle(slug, user);

    return { article };
  }
}
