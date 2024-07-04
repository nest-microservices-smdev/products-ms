import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
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

    const totalPages = await this.product.count();
    const lastPage = Math.ceil(totalPages / limit);

    const products: Product[] = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
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
      where: { id },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
