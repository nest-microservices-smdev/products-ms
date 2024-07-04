import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { Product } from './entities/product.entity';
import { PaginationResult } from 'src/common/interfaces';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Dtabase Connected');
  }
  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResult<Product>> {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);

    const products: Product[] = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { available: true },
    });

    const meta = {
      total: totalPages,
      page,
      lastPage,
    };

    return {
      data: products,
      meta,
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.product.findUnique({
      where: {
        id,
        available: true,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number): Promise<Product> {
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
  }
}
