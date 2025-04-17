import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { ResponseMessages } from '../common/response-messages';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';

@Injectable()
export class CourseService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createCourse(createCourseDto: CreateCourseDto) {
    try {
      const {
        name,
        description,
        intro,
        prerequisites,
        level,
        categoryId,
        subcategoryId,
        imageUrl,
        pricingId,
        teacherId,
      } = createCourseDto;

      // Validate category
      const category = await this.databaseService.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.category.category_not_found,
        ).getResponse();
      }

      // Validate subcategory if provided
      if (subcategoryId) {
        const subcategory = await this.databaseService.subcategory.findUnique({
          where: { id: subcategoryId },
        });
        if (!subcategory) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.subcategory.subcategory_not_found,
          ).getResponse();
        }
      }

      // Validate pricing if provided
      if (pricingId) {
        const pricing = await this.databaseService.pricing.findUnique({
          where: { id: pricingId },
        });
        if (!pricing) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.pricing.pricing_not_found,
          ).getResponse();
        }
        // Check if pricing is already assigned to another course
        const existingCourseWithPricing =
          await this.databaseService.course.findFirst({
            where: { pricingId },
          });
        if (existingCourseWithPricing) {
          return new ResponseError(
            { name: 'badRequest' },
            'Pricing is already assigned to another course.',
          ).getResponse();
        }
      }

      // Validate teacher
      const teacher = await this.databaseService.user.findUnique({
        where: { id: teacherId },
      });
      if (!teacher) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.user.user_not_found,
        ).getResponse();
      }

      const course = await this.databaseService.course.create({
        data: {
          name,
          description,
          intro,
          prerequisites,
          level,
          category: { connect: { id: categoryId } },
          subcategory: subcategoryId
            ? { connect: { id: subcategoryId } }
            : undefined,
          imageUrl,
          pricing: pricingId ? { connect: { id: pricingId } } : undefined,
          teacher: { connect: { id: teacherId } },
        },
      });

      return new ResponseSuccess(
        course,
        ResponseMessages.course.course_created,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async getAllCourses() {
    try {
      const courses = await this.databaseService.course.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          intro: true,
          prerequisites: true,
          level: true,
          categoryId: true,
          subcategoryId: true,
          imageUrl: true,
          pricingId: true,
          teacherId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new ResponseSuccess(
        courses,
        ResponseMessages.course.courses_retrieved,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async getCourseById(id: string) {
    try {
      const course = await this.databaseService.course.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          intro: true,
          prerequisites: true,
          level: true,
          categoryId: true,
          subcategoryId: true,
          imageUrl: true,
          pricingId: true,
          teacherId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!course) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.course.course_not_found,
        ).getResponse();
      }

      return new ResponseSuccess(
        course,
        ResponseMessages.course.course_fetched,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const {
        name,
        description,
        intro,
        prerequisites,
        level,
        categoryId,
        subcategoryId,
        imageUrl,
        pricingId,
        teacherId,
      } = updateCourseDto;

      const course = await this.databaseService.course.findUnique({
        where: { id },
      });

      if (!course) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.course.course_not_found,
        ).getResponse();
      }

      // Validate category if provided
      if (categoryId) {
        const category = await this.databaseService.category.findUnique({
          where: { id: categoryId },
        });
        if (!category) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.category.category_not_found,
          ).getResponse();
        }
      }

      // Validate subcategory if provided
      if (subcategoryId) {
        const subcategory = await this.databaseService.subcategory.findUnique({
          where: { id: subcategoryId },
        });
        if (!subcategory) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.subcategory.subcategory_not_found,
          ).getResponse();
        }
      }

      // Validate pricing if provided
      if (pricingId) {
        const pricing = await this.databaseService.pricing.findUnique({
          where: { id: pricingId },
        });
        if (!pricing) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.pricing.pricing_not_found,
          ).getResponse();
        }
        // Check if pricing is assigned to another course
        const existingCourseWithPricing =
          await this.databaseService.course.findFirst({
            where: { pricingId, NOT: { id } },
          });
        if (existingCourseWithPricing) {
          return new ResponseError(
            { name: 'badRequest' },
            'Pricing is already assigned to another course.',
          ).getResponse();
        }
      }

      // Validate teacher if provided
      if (teacherId) {
        const teacher = await this.databaseService.user.findUnique({
          where: { id: teacherId },
        });
        if (!teacher) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.user.user_not_found,
          ).getResponse();
        }
      }

      const updatedCourse = await this.databaseService.course.update({
        where: { id },
        data: {
          name: name ?? course.name,
          description: description ?? course.description,
          intro: intro ?? course.intro,
          prerequisites: prerequisites ?? course.prerequisites,
          level: level ?? course.level,
          category: categoryId ? { connect: { id: categoryId } } : undefined,
          subcategory: subcategoryId
            ? { connect: { id: subcategoryId } }
            : undefined,
          imageUrl: imageUrl ?? course.imageUrl,
          pricing: pricingId ? { connect: { id: pricingId } } : undefined,
          teacher: teacherId ? { connect: { id: teacherId } } : undefined,
        },
        select: {
          id: true,
          name: true,
          description: true,
          intro: true,
          prerequisites: true,
          level: true,
          categoryId: true,
          subcategoryId: true,
          imageUrl: true,
          pricingId: true,
          teacherId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new ResponseSuccess(
        updatedCourse,
        ResponseMessages.course.course_updated,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async deleteCourse(id: string) {
    try {
      const course = await this.databaseService.course.findUnique({
        where: { id },
      });

      if (!course) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.course.course_not_found,
        ).getResponse();
      }

      await this.databaseService.course.delete({
        where: { id },
      });

      return new ResponseSuccess(
        null,
        ResponseMessages.course.course_deleted,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }
}
