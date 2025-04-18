import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ResponseMessages } from '../common/response-messages';
import { ResponseError, ResponseSuccess } from '../common/dto/response.dto';

@Injectable()
export class ChapterService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createChapterDto: CreateChapterDto) {
    try {
      const { courseId, title, order } = createChapterDto;

      // Validate course
      const course = await this.databaseService.course.findUnique({
        where: { id: courseId },
      });
      if (!course) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.course.course_not_found,
        ).getResponse();
      }

      // Validate unique order within course
      const existingChapter = await this.databaseService.chapter.findFirst({
        where: { courseId, order },
      });
      if (existingChapter) {
        return new ResponseError(
          { name: 'badRequest' },
          'A chapter with this order already exists in the course.',
        ).getResponse();
      }

      const chapter = await this.databaseService.chapter.create({
        data: {
          course: { connect: { id: courseId } },
          title,
          order,
        },
        include: {
          course: { select: { id: true, name: true } },
          sections: { select: { id: true, title: true, order: true } },
        },
      });

      return new ResponseSuccess(
        chapter,
        ResponseMessages.chapter?.chapter_created ||
          'Chapter created successfully.',
      ).getResponse();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return new ResponseError(
          { name: 'badRequest' },
          'A chapter with this order already exists in the course.',
        ).getResponse();
      }
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async findAll() {
    try {
      const chapters = await this.databaseService.chapter.findMany({
        include: {
          course: { select: { id: true, name: true } },
          sections: { select: { id: true, title: true, order: true } },
        },
      });

      return new ResponseSuccess(
        chapters,
        ResponseMessages.chapter?.chapter_retrieved ||
          'Chapters retrieved successfully.',
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async findOne(id: string) {
    try {
      const chapter = await this.databaseService.chapter.findUnique({
        where: { id },
        include: {
          course: { select: { id: true, name: true } },
          sections: { select: { id: true, title: true, order: true } },
        },
      });

      if (!chapter) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.chapter?.chapter_not_found || 'Chapter not found.',
        ).getResponse();
      }

      return new ResponseSuccess(
        chapter,
        ResponseMessages.chapter?.chapter_fetched ||
          'Chapter retrieved successfully.',
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async update(id: string, updateChapterDto: UpdateChapterDto) {
    try {
      const { courseId, title, order } = updateChapterDto;

      const chapter = await this.databaseService.chapter.findUnique({
        where: { id },
      });
      if (!chapter) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.chapter?.chapter_not_found || 'Chapter not found.',
        ).getResponse();
      }

      // Validate course if provided
      if (courseId) {
        const course = await this.databaseService.course.findUnique({
          where: { id: courseId },
        });
        if (!course) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.course.course_not_found,
          ).getResponse();
        }
      }

      // Validate unique order within course if provided
      if (order !== undefined) {
        const existingChapter = await this.databaseService.chapter.findFirst({
          where: { courseId: courseId || chapter.courseId, order, NOT: { id } },
        });
        if (existingChapter) {
          return new ResponseError(
            { name: 'badRequest' },
            'A chapter with this order already exists in the course.',
          ).getResponse();
        }
      }

      const updatedChapter = await this.databaseService.chapter.update({
        where: { id },
        data: {
          course: courseId ? { connect: { id: courseId } } : undefined,
          title: title ?? chapter.title,
          order: order ?? chapter.order,
        },
        include: {
          course: { select: { id: true, name: true } },
          sections: { select: { id: true, title: true, order: true } },
        },
      });

      return new ResponseSuccess(
        updatedChapter,
        ResponseMessages.chapter?.chapter_updated ||
          'Chapter updated successfully.',
      ).getResponse();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return new ResponseError(
          { name: 'badRequest' },
          'A chapter with this order already exists in the course.',
        ).getResponse();
      }
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async delete(id: string) {
    try {
      const chapter = await this.databaseService.chapter.findUnique({
        where: { id },
      });
      if (!chapter) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.chapter?.chapter_not_found || 'Chapter not found.',
        ).getResponse();
      }

      await this.databaseService.chapter.delete({
        where: { id },
      });

      return new ResponseSuccess(
        null,
        ResponseMessages.chapter?.chapter_deleted ||
          'Chapter deleted successfully.',
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }
}
