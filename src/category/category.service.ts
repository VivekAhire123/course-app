import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto/subcategory.dto';
import { ResponseMessages } from '../common/response-messages';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.databaseService.category.create({
        data: {
          name: createCategoryDto.name,
        },
      });

      return new ResponseSuccess(
        category,
        ResponseMessages.category.category_created,
      );
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      );
    }
  }

  async getAllCategories() {
    try {
      const categories = await this.databaseService.category.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new ResponseSuccess(
        categories,
        ResponseMessages.category.categories_retrieved,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async getCategoryById(id: string) {
    try {
      const category = await this.databaseService.category.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!category) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.category.category_not_found,
        ).getResponse();
      }

      return new ResponseSuccess(
        category,
        ResponseMessages.category.category_fetched,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.databaseService.category.findUnique({
        where: { id },
      });

      if (!category) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.category.category_not_found,
        ).getResponse();
      }

      const updatedCategory = await this.databaseService.category.update({
        where: { id },
        data: {
          name: updateCategoryDto.name,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new ResponseSuccess(
        updatedCategory,
        ResponseMessages.category.category_updated,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async deleteCategory(id: string) {
    try {
      const category = await this.databaseService.category.findUnique({
        where: { id },
      });

      if (!category) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.category.category_not_found,
        ).getResponse();
      }

      await this.databaseService.category.delete({
        where: { id },
      });

      return new ResponseSuccess(
        null,
        ResponseMessages.category.category_deleted,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async createSubCategory(createSubCategoryDto: CreateSubCategoryDto) {
    try {
      const { name, categoryId } = createSubCategoryDto;

      const category = await this.databaseService.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.category.category_not_found,
        ).getResponse();
      }

      const subCategory = await this.databaseService.subcategory.create({
        data: {
          name,
          categoryId,
        },
      });

      return new ResponseSuccess(
        subCategory,
        ResponseMessages.subcategory.subcategory_created,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async getAllSubCategories() {
    try {
      const subCategories = await this.databaseService.subcategory.findMany({
        select: {
          id: true,
          name: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new ResponseSuccess(
        subCategories,
        ResponseMessages.subcategory.subcategories_retrieved,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async getSubCategoryById(id: string) {
    try {
      const subCategory = await this.databaseService.subcategory.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!subCategory) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.subcategory.subcategory_not_found,
        ).getResponse();
      }

      return new ResponseSuccess(
        subCategory,
        ResponseMessages.subcategory.subcategory_fetched,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async updateSubCategory(
    id: string,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    try {
      const { name, categoryId } = updateSubCategoryDto;

      const subCategory = await this.databaseService.subcategory.findUnique({
        where: { id },
      });

      if (!subCategory) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.subcategory.subcategory_not_found,
        ).getResponse();
      }

      const category = await this.databaseService.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.category.category_not_found,
        ).getResponse();
      }

      const updatedSubCategory = await this.databaseService.subcategory.update({
        where: { id },
        data: {
          name: name ?? subCategory.name,
          categoryId,
        },
        select: {
          id: true,
          name: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return new ResponseSuccess(
        updatedSubCategory,
        ResponseMessages.subcategory.subcategory_updated,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }

  async deleteSubCategory(id: string) {
    try {
      const subCategory = await this.databaseService.subcategory.findUnique({
        where: { id },
      });

      if (!subCategory) {
        return new ResponseError(
          { name: 'notFound' },
          ResponseMessages.subcategory.subcategory_not_found,
        ).getResponse();
      }

      await this.databaseService.subcategory.delete({
        where: { id },
      });

      return new ResponseSuccess(
        null,
        ResponseMessages.subcategory.subcategory_deleted,
      ).getResponse();
    } catch (error) {
      return new ResponseError(
        { name: 'internalServerError' },
        ResponseMessages.common.internal_server_error,
      ).getResponse();
    }
  }
}
