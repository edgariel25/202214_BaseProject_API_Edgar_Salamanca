import { Controller, UseInterceptors, Get, Param, Post, Body, Put, Delete, HttpCode } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { SupermercadoDto } from './supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
    constructor(private readonly supermercadoService: SupermercadoService){}

    @Get()
    async findAll() {
        return await this.supermercadoService.findAll();
    }

    @Get(':supermarketId')
    async findOne(@Param('supermarketId') supermarketId: string) {
        return await this.supermercadoService.findOne(supermarketId);
    }

    @Post()
    async create(@Body() supermercadoDto: SupermercadoDto) {
        const supermarket: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermercadoDto);
        return await this.supermercadoService.create(supermarket);
    }

    @Put(':supermarketId')
    async update(@Param('supermarketId') supermarketId: string, @Body() supermarketDto: SupermercadoDto) {
        const supermarket: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermarketDto);
        return await this.supermercadoService.update(supermarketId, supermarket);
    }

    @Delete(':supermarketId')
    @HttpCode(204)
    async delete(@Param('supermarketId') supermarketId: string) {
        return await this.supermercadoService.delete(supermarketId);
    }
}
