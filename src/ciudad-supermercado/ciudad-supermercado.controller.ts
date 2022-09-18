import { Controller, UseInterceptors, Get, Param, Post, Body, Put, Delete, HttpCode } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
    constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService){}

    @Post(':cityId/supermarkets/:supermarketId')
   async addArtworkMuseum(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
       return await this.ciudadSupermercadoService.addSupermarketToCity(cityId, supermarketId);
   }
   
}
