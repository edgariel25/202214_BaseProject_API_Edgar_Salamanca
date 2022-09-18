import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoService } from '../supermercado/supermercado.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
    providers: [CiudadSupermercadoService, SupermercadoService],
    controllers: [CiudadSupermercadoController],
})
export class CiudadSupermercadoModule {}
