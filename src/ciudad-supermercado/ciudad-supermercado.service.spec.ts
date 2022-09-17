import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { faker } from '@faker-js/faker';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let ciudad: CiudadEntity;
  let listaSupermercados: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity),);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity),);

    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();
 
    listaSupermercados = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await supermercadoRepository.save({
          nombre: faker.company.name(),
          longitud: faker.address.longitude(),
          latitud: faker.address.latitude(),
          paginaWeb: faker.internet.domainName()
        })
        listaSupermercados.push(supermercado);
    }
 
    ciudad = await ciudadRepository.save({
      nombre: faker.address.cityName(),
      pais: faker.address.country(),
      habitantes: faker.datatype.number(),
      supermercados: listaSupermercados
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addArtworkMuseum should add an artwork to a museum', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.domainName()
    });
 
    const nuevaCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.address.cityName(),
      pais: faker.address.country(),
      habitantes: faker.datatype.number()
    })
 
    const result: CiudadEntity = await service.addSupermarketToCity(nuevaCiudad.id, nuevoSupermercado.id);
   
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(nuevoSupermercado.nombre)
    expect(result.supermercados[0].longitud).toBe(nuevoSupermercado.longitud)
    expect(result.supermercados[0].latitud).toBe(nuevoSupermercado.latitud)
    expect(result.supermercados[0].paginaWeb).toBe(nuevoSupermercado.paginaWeb)
  });

  it('addArtworkMuseum should thrown exception for an invalid artwork', async () => {
    const nuevaCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.address.cityName(),
      pais: faker.address.country(),
      habitantes: faker.datatype.number()
    })
 
    await expect(() => service.addSupermarketToCity(nuevaCiudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('findArtworkByMuseumIdArtworkId should return artwork by museum', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    const supermercadoAlmacenado: SupermercadoEntity = await service.findSupermarketFromCity(ciudad.id, supermercado.id, )
    expect(supermercadoAlmacenado).not.toBeNull();
    expect(supermercadoAlmacenado.nombre).toBe(supermercado.nombre);
    expect(supermercadoAlmacenado.latitud).toBe(supermercado.latitud);
    expect(supermercadoAlmacenado.longitud).toBe(supermercado.longitud);
    expect(supermercadoAlmacenado.paginaWeb).toBe(supermercado.paginaWeb);
  });

});
