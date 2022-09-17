import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CiudadSupermercadoService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,

        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>){}

/*
addSupermarketToCity: Asociar un supermercado a una ciudad.
findSupermarketsFromCity: Obtener los supermercados que tiene una ciudad.
findSupermarketFromCity: Obtener un supermercado de una ciudad.
updateSupermarketsFromCity: Actualizar los supermercados que tiene una ciudad.
deleteSupermarketFromCity: Eliminar el supermercado que tiene una ciudad.
*/
async addSupermarketToCity(ciudadId: string, supermercadoId: string): Promise<CiudadEntity> {
    const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}});
    if (!supermercado)
      throw new BusinessLogicException("El supermercado con el id dado no fue encontrado", BusinessError.NOT_FOUND);
  
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]})
    if (!ciudad)
      throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND);

    if (supermercado.nombre.length < 10 )
      throw new BusinessLogicException("El nombre del supermercado debe ser de mas de 10 caracteres", BusinessError.BAD_REQUEST);

    ciudad.supermercados = [...ciudad.supermercados, supermercado];
    return await this.ciudadRepository.save(ciudad);
  }

async findSupermarketFromCity(ciudadId: string, supermercadoId: string): Promise<SupermercadoEntity> {
    const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermercadoId}});
    if (!supermercado)
        throw new BusinessLogicException("El supermercado con el id dado no fue encontrado", BusinessError.NOT_FOUND);
   
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]})
    if (!ciudad)
        throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND);

    const ciudadSupermercado: SupermercadoEntity = ciudad.supermercados.find(e => e.id === supermercado.id);

    if (!ciudadSupermercado)
      throw new BusinessLogicException("El supermercado con el id dado no esta asociado a la ciudad", BusinessError.PRECONDITION_FAILED)

    return ciudadSupermercado;
}

async findSupermarketsFromCity(ciudadId: string): Promise<SupermercadoEntity[]> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: ciudadId}, relations: ["supermercados"]});
    if (!ciudad)
      throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND)
   
    return ciudad.supermercados;
}
}
