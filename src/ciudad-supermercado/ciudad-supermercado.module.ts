import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CiudadService } from '../ciudad/ciudad.service';

@Module({
    imports: [TypeOrmModule.forFeature([CiudadEntity])],
    providers: [CiudadService],
})
export class CiudadSupermercadoModule {}
