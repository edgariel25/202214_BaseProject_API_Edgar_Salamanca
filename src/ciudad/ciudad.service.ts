import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';
import { validateCountry } from '../shared/validations/validateCountry';

@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>){}

        async findAll(): Promise<CiudadEntity[]> {
            return await this.ciudadRepository.find({ });
        }

        async findOne(id: string): Promise<CiudadEntity> {
            const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, } );
            if (!ciudad)
              throw new BusinessLogicException("La cuidad no fue encontrada", BusinessError.NOT_FOUND);
       
            return ciudad;
        }

        async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
            if (!validateCountry(ciudad.pais) )
              throw new BusinessLogicException("El pais no pertenece al listado Argentina, Ecuador o Paraguay", BusinessError.BAD_REQUEST);
  
            return await this.ciudadRepository.save(ciudad);
        }

        async update(id: string, nuevaCiudad: CiudadEntity): Promise<CiudadEntity> {
            const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
            if (!ciudad)
              throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND);
            
            if (!validateCountry(nuevaCiudad.pais) )
              throw new BusinessLogicException("El pais no pertenece al listado Argentina, Ecuador o Paraguay", BusinessError.BAD_REQUEST);

            return await this.ciudadRepository.save({...ciudad, ...nuevaCiudad});
        }

        async delete(id: string) {
            const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{id}});
            if (!ciudad)
              throw new BusinessLogicException("La ciudad con el id dado no fue encontrada", BusinessError.NOT_FOUND);
         
            await this.ciudadRepository.remove(ciudad);
        }
}
