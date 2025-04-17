import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePricingDto, UpdatePricingDto } from './dto/pricing.dto';
import { ResponseMessages } from '../common/response-messages';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';

@Injectable()
export class PricingService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createPricing(createPricingDto: CreatePricingDto) {
    try {
      const { currency, amount, discount, courseId } = createPricingDto;

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

      const pricing = await this.databaseService.pricing.create({
        data: {
          currency,
          amount,
          discount,
          course: courseId ? { connect: { id: courseId } } : undefined,
        },
      });

      return new ResponseSuccess(
        pricing,
        ResponseMessages.pricing.pricing_created,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async getAllPricings() {
    try {
      const pricings = await this.databaseService.pricing.findMany({
        select: {
          id: true,
          currency: true,
          amount: true,
          discount: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new ResponseSuccess(
        pricings,
        ResponseMessages.pricing.pricings_retrieved,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async getPricingById(id: string) {
    try {
      const pricing = await this.databaseService.pricing.findUnique({
        where: { id },
        select: {
          id: true,
          currency: true,
          amount: true,
          discount: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!pricing) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.pricing.pricing_not_found,
        ).getResponse();
      }

      return new ResponseSuccess(
        pricing,
        ResponseMessages.pricing.pricing_fetched,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async updatePricing(id: string, updatePricingDto: UpdatePricingDto) {
    try {
      const { currency, amount, discount, courseId } = updatePricingDto;

      const pricing = await this.databaseService.pricing.findUnique({
        where: { id },
      });

      if (!pricing) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.pricing.pricing_not_found,
        ).getResponse();
      }

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

      const updatedPricing = await this.databaseService.pricing.update({
        where: { id },
        data: {
          currency: currency ?? pricing.currency,
          amount: amount ?? pricing.amount,
          discount: discount ?? pricing.discount,
          course: courseId ? { connect: { id: courseId } } : undefined,
        },
        select: {
          id: true,
          currency: true,
          amount: true,
          discount: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new ResponseSuccess(
        updatedPricing,
        ResponseMessages.pricing.pricing_updated,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async deletePricing(id: string) {
    try {
      const pricing = await this.databaseService.pricing.findUnique({
        where: { id },
      });

      if (!pricing) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.pricing.pricing_not_found,
        ).getResponse();
      }

      await this.databaseService.pricing.delete({
        where: { id },
      });

      return new ResponseSuccess(
        null,
        ResponseMessages.pricing.pricing_deleted,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }
}
