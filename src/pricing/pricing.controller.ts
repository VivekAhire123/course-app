import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PricingService } from './pricing.service';
import { CreatePricingDto, UpdatePricingDto } from './dto/pricing.dto';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('add')
  async createPricing(
    @Body() createPricingDto: CreatePricingDto,
  ): Promise<any> {
    return this.pricingService.createPricing(createPricingDto);
  }

  @Get('viewAll')
  async getAllPricings(): Promise<any> {
    return this.pricingService.getAllPricings();
  }

  @Get('/view/:id')
  async getPricingById(@Param('id') id: string): Promise<any> {
    return this.pricingService.getPricingById(id);
  }

  @Patch('/update/:id')
  async updatePricing(
    @Param('id') id: string,
    @Body() updatePricingDto: UpdatePricingDto,
  ): Promise<any> {
    return this.pricingService.updatePricing(id, updatePricingDto);
  }

  @Delete('/delete/:id')
  async deletePricing(@Param('id') id: string): Promise<any> {
    return this.pricingService.deletePricing(id);
  }
}
