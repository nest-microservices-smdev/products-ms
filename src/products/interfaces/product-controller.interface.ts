import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationDto } from 'src/common/dto';
import { Product } from '../entities/product.entity';
import { PaginationResult } from 'src/common/interfaces';

export interface IProductsController {
  create(createProductDto: CreateProductDto): Promise<Product>;
  findAll(paginationDto: PaginationDto): Promise<PaginationResult<Product>>;
  findOne(id: number): Promise<Product>;
  update(updateProductDto: UpdateProductDto): Promise<Product>;
}
