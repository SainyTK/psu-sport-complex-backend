import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Delete,
  Param,
  Query,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from '../config/multer.config';
import { NewsDTO } from './dto/news.dto';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
  ) { }

  @Get()
  async getNewsFeed(@Query('limit') limit, @Query('offset') offset, @Res() res) {
    const result = await this.newsService.getNewsFeed(offset, limit);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get('/:newsId')
  async getNews(@Param('newsId') newsId, @Res() res) {
    const result = await this.newsService.getNews(newsId);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post()
  async createNews(@Body() data: NewsDTO, @Res() res) {
    const result = await this.newsService.createNews(NewsDTO.toModel(data));
    return res.status(HttpStatus.OK).json(result);
  }

  @Patch('/:newsId')
  async updateNews(@Param('newsId') id: number, @Body() data, @Res() res) {
    const result = await this.newsService.updateNews(id, data);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete('/:newsId')
  async deleteBlackout(@Param('newsId') id: number, @Res() res) {
    const result = await this.newsService.deleteNews(id);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadImage(@UploadedFile() file) {
    return file;
  }

  @Get('/image/:filename')
  async getImage(@Res() res, @Param('filename') filename) {
    return res.sendFile(filename, { root: 'uploads' });
  }

}
