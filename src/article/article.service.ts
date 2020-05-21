import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateArticleDTO, UpdateArticleDTO } from '../models/article.models';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
  }

  async findBySlug(slug: string) {
    return this.articleRepository.findOne({ where: { slug } });
  }

  private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
    return article.author.id === user.id;
  }

  async createArticle(user: UserEntity, data: CreateArticleDTO) {
    const article = this.articleRepository.create(data);
    article.author = user;
    await article.save();

    return article;
  }

  async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }
    await this.articleRepository.update({ slug }, data);

    return article;
  }

  async deleteArticle(slug: string, user: UserEntity) {
    const article = await this.findBySlug(slug);
    if (!this.ensureOwnership(user, article)) {
      throw new UnauthorizedException();
    }

    await this.articleRepository.remove(article);
  }
}
