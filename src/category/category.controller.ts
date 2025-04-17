// src/category/category.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters,
  Patch,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto/subcategory.dto';
import { AllExceptionsFilter } from '../common/filters/all-exception.filter';

@Controller('categories')
@UseFilters(AllExceptionsFilter)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/add')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get('/viewAll')
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get('/view/:id')
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Patch('/update/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete('/delete/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Post('/sub-category/add')
  createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.categoryService.createSubCategory(createSubCategoryDto);
  }

  @Get('/sub-category/viewAll')
  getAllSubCategories() {
    return this.categoryService.getAllSubCategories();
  }

  @Get('/sub-category/view/:id')
  getSubCategoryById(@Param('id') id: string) {
    return this.categoryService.getSubCategoryById(id);
  }

  @Patch('/sub-category/update/:id')
  updateSubCategory(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.categoryService.updateSubCategory(id, updateSubCategoryDto);
  }

  @Delete('/sub-category/delete/:id')
  deleteSubCategory(@Param('id') id: string) {
    return this.categoryService.deleteSubCategory(id);
  }
}
