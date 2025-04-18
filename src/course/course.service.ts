import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { ResponseMessages } from '../common/response-messages';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { S3Service } from 'src/common/s3/s3.service';

@Injectable()
export class CourseService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  async createCourse(
    createCourseDto: CreateCourseDto,
    image?: Express.Multer.File,
  ) {
    try {
      const {
        name,
        description,
        intro,
        prerequisites,
        level,
        categoryId,
        subcategoryId,
        imageUrl: imageUrlDto,
        pricingId,
        teacherId,
      } = createCourseDto;

      const category = await this.databaseService.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.category.category_not_found,
        );
      }

      if (subcategoryId) {
        const subcategory = await this.databaseService.subcategory.findUnique({
          where: { id: subcategoryId },
        });
        if (!subcategory) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.subcategory.subcategory_not_found,
          );
        }
      }

      if (pricingId) {
        const pricing = await this.databaseService.pricing.findUnique({
          where: { id: pricingId },
        });
        if (!pricing) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.pricing.pricing_not_found,
          );
        }

        const existingCourseWithPricing =
          await this.databaseService.course.findFirst({
            where: { pricingId },
          });
        if (existingCourseWithPricing) {
          return new ResponseError(
            { name: 'badRequest' },
            'Pricing is already assigned to another course.',
          );
        }
      }

      const teacher = await this.databaseService.user.findUnique({
        where: { id: teacherId },
      });
      if (!teacher) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.user.user_not_found,
        );
      }

      let finalImageUrl = imageUrlDto;
      if (image) {
        const s3Key = await this.s3Service.uploadImage(image);
        finalImageUrl = s3Key;
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
          imageUrl: finalImageUrl,
          pricing: pricingId ? { connect: { id: pricingId } } : undefined,
          teacher: { connect: { id: teacherId } },
        },
      });

      return new ResponseSuccess(
        course,
        ResponseMessages.course.course_created,
      );
    } catch (error) {
      console.log('Error adding course:', error);
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
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

      const coursesWithSignedUrls = await Promise.all(
        courses.map(async (course) => {
          const signedUrl = course.imageUrl
            ? await this.s3Service.getSignedUrl(course.imageUrl)
            : null;

          return {
            ...course,
            imageUrl: signedUrl,
          };
        }),
      );

      return new ResponseSuccess(
        coursesWithSignedUrls,
        ResponseMessages.course.courses_retrieved,
      );
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
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
        );
      }

      const signedUrl = course.imageUrl
        ? await this.s3Service.getSignedUrl(course.imageUrl)
        : null;

      return new ResponseSuccess(
        {
          ...course,
          imageUrl: signedUrl,
        },
        ResponseMessages.course.course_fetched,
      );
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
    image?: Express.Multer.File,
  ) {
    try {
      const {
        name,
        description,
        intro,
        prerequisites,
        level,
        categoryId,
        subcategoryId,
        imageUrl: imageUrlDto,
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
        );
      }

      // Validate category
      if (categoryId) {
        const category = await this.databaseService.category.findUnique({
          where: { id: categoryId },
        });
        if (!category) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.category.category_not_found,
          );
        }
      }

      // Validate subcategory
      if (subcategoryId) {
        const subcategory = await this.databaseService.subcategory.findUnique({
          where: { id: subcategoryId },
        });
        if (!subcategory) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.subcategory.subcategory_not_found,
          );
        }
      }

      // Validate pricing
      if (pricingId) {
        const pricing = await this.databaseService.pricing.findUnique({
          where: { id: pricingId },
        });
        if (!pricing) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.pricing.pricing_not_found,
          );
        }

        const existingCourseWithPricing =
          await this.databaseService.course.findFirst({
            where: { pricingId, NOT: { id } },
          });
        if (existingCourseWithPricing) {
          return new ResponseError(
            { name: 'badRequest' },
            'Pricing is already assigned to another course.',
          );
        }
      }

      // Validate teacher
      if (teacherId) {
        const teacher = await this.databaseService.user.findUnique({
          where: { id: teacherId },
        });
        if (!teacher) {
          return new ResponseError(
            { name: 'notFound' },
            ResponseMessages.user.user_not_found,
          );
        }
      }

      // Upload image if provided
      let finalImageUrl = imageUrlDto ?? course.imageUrl;
      if (image) {
        const s3Key = await this.s3Service.uploadImage(image);
        finalImageUrl = s3Key;
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
          imageUrl: finalImageUrl,
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
      );
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
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
        );
      }

      await this.databaseService.course.delete({
        where: { id },
      });

      return new ResponseSuccess(null, ResponseMessages.course.course_deleted);
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }
}
