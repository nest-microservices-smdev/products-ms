import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { IProductsController } from './interfaces/product-controller.interface';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto';
import { getActionName } from 'src/common/constants';

const ACTIONS = getActionName('product');

@Controller('products')
export class ProductsController implements IProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: ACTIONS.create })
  async create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: ACTIONS.findAll })
  async findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: ACTIONS.findOne })
  async findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: ACTIONS.update })
  async update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  @MessagePattern({ cmd: ACTIONS.delete })
  async remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern({ cmd: ACTIONS.validate_products })
  async validateProducts(@Payload('ids') ids: number[]) {
    return this.productsService.validateProducts(ids);
  }
}
