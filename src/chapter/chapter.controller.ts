import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { IsUUID } from 'class-validator';

class ChapterIdParams {
  @IsUUID('4')
  id: string;
}

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto);
  }

  @Get()
  findAll() {
    return this.chapterService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: ChapterIdParams) {
    return this.chapterService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: ChapterIdParams,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chapterService.update(params.id, updateChapterDto);
  }

  @Delete(':id')
  delete(@Param() params: ChapterIdParams) {
    return this.chapterService.delete(params.id);
  }
}
