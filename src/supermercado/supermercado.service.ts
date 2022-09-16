import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';

@Injectable()
export class SupermercadoService {
    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>){}

        async findAll(): Promise<SupermercadoEntity[]> {
            return await this.supermercadoRepository.find({ });
        }

        async findOne(id: string): Promise<SupermercadoEntity> {
            const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id}, } );
            if (!supermercado)
              throw new BusinessLogicException("El supermercado no fue encontrado", BusinessError.NOT_FOUND);
       
            return supermercado;
        }

        async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
          if (supermercado.nombre.length < 10 )
            throw new BusinessLogicException("El nombre del supermercado debe ser de mas de 10 caracteres", BusinessError.BAD_REQUEST);

          return await this.supermercadoRepository.save(supermercado);
        }

        async update(id: string, nuevoSupermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
            const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
            if (!supermercado)
              throw new BusinessLogicException("El supermercado con el id dado no fue encontrado", BusinessError.NOT_FOUND);
            
            if (nuevoSupermercado.nombre.length < 10 )
              throw new BusinessLogicException("El nombre del supermercado debe ser de mas de 10 caracteres", BusinessError.BAD_REQUEST);

            return await this.supermercadoRepository.save({...supermercado, ...nuevoSupermercado});
        }

        async delete(id: string) {
            const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
            if (!supermercado)
              throw new BusinessLogicException("El supermercado con el id dado no fue encontrado", BusinessError.NOT_FOUND);
         
            await this.supermercadoRepository.remove(supermercado);
        }
}
