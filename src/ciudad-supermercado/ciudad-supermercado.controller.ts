import { Controller, UseInterceptors, Get, Param, Post, Body, Put, Delete, HttpCode } from '@nestjs/common';
import { SupermercadoDto } from '../supermercado/supermercado.dto';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
    constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService){}

   @Post(':cityId/supermarkets/:supermarketId')
   async addSupermarketToCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
       return await this.ciudadSupermercadoService.addSupermarketToCity(cityId, supermarketId);
   }
   
   @Get(':cityId/supermarkets')
   async findSupermarketsFromCity(@Param('cityId') cityId: string){
       return await this.ciudadSupermercadoService.findSupermarketsFromCity(cityId);
   }

   @Get(':cityId/supermarkets/:supermarketId')
   async findSupermarketFromCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
       return await this.ciudadSupermercadoService.findSupermarketFromCity(cityId, supermarketId);
   }

   @Put(':cityId/supermarkets')
   async updateSupermarketsFromCity(@Body() supermercadoDto: SupermercadoDto[], @Param('cityId') cityId: string){
       const supermercados = plainToInstance(SupermercadoEntity, supermercadoDto)
       return await this.ciudadSupermercadoService.updateSupermarketsFromCity(cityId, supermercados);
   }

   @Delete(':cityId/supermarkets/:supermarketId')
   @HttpCode(204)
   async deleteArtworkMuseum(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
        return await this.ciudadSupermercadoService.deleteSupermarketFromCity(cityId, supermarketId);
   }
}
