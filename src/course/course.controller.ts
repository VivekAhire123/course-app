import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('image'))
  createCourse(
    @UploadedFile() image: Express.Multer.File,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.courseService.createCourse(createCourseDto, image);
  }

  @Get('viewAll')
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get('/view/:id')
  getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateCourse(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, updateCourseDto, image);
  }

  @Delete('/delete/:id')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}
