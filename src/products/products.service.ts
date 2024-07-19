import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { Product } from './entities/product.entity';
import { PaginationResult } from 'src/common/interfaces';
import { RpcException } from '@nestjs/microservices';

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
        id: Number(id),
        available: true,
      },
    });

    if (!product) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product with id ${id} not found`,
      });
    }

    return product;
  }

  async update(updateProductDto: UpdateProductDto): Promise<Product> {
    const { id, ...restData } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: restData,
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

  async validateProducts(productIds: number[]): Promise<Product[]> {
    const ids = [...new Set(productIds)];

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
        available: true,
      },
    });

    if (products.length !== ids.length) {
      const notFoundIds = ids.filter(
        (id) => !products.map((product) => product.id).includes(id),
      );

      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Products with ids ${notFoundIds.join(', ')} not found`,
      });
    }

    return products;
  }
}
