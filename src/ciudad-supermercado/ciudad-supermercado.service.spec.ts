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

  it('addSupermarketToCity debe adicionar un supermercado a una ciudad', async () => {
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

  it('addSupermarketToCity debe lanzar excepcion por un supermercado invalido', async () => {
    const nuevaCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.address.cityName(),
      pais: faker.address.country(),
      habitantes: faker.datatype.number()
    })
 
    await expect(() => service.addSupermarketToCity(nuevaCiudad.id, "0")).rejects.
    toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('addSupermarketToCity debe lanzar excepcion por una ciudad invalida', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.domainName()
    });
 
    await expect(() => service.addSupermarketToCity("0", nuevoSupermercado.id)).rejects.
    toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('addSupermarketToCity debe lanzar excepcion por nombre de supermercado menor a 10 caracteres', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: "vip",
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.domainName()
    });

    const nuevaCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.address.cityName(),
      pais: faker.address.country(),
      habitantes: faker.datatype.number()
    })
 
    await expect(() => service.addSupermarketToCity(nuevaCiudad.id, nuevoSupermercado.id)).rejects.
    toHaveProperty("message", "El nombre del supermercado debe ser de mas de 10 caracteres");
  });

  it('findSupermarketFromCity debe retornar un supermercado por ciudad', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    const supermercadoAlmacenado: SupermercadoEntity = await service.findSupermarketFromCity(ciudad.id, supermercado.id, )
    expect(supermercadoAlmacenado).not.toBeNull();
    expect(supermercadoAlmacenado.nombre).toBe(supermercado.nombre);
    expect(supermercadoAlmacenado.latitud).toBe(supermercado.latitud);
    expect(supermercadoAlmacenado.longitud).toBe(supermercado.longitud);
    expect(supermercadoAlmacenado.paginaWeb).toBe(supermercado.paginaWeb);
  });
  
  it('findSupermarketFromCity debe lanzar excepcion por un supermercado invalido', async () => {
    await expect(()=> service.findSupermarketFromCity(ciudad.id, "0")).rejects.
    toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('findSupermarketFromCity should debe lanzar excepcion por una ciudad invalida', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    await expect(()=> service.findSupermarketFromCity("0", supermercado.id)).rejects.
    toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('findSupermarketFromCity debe lanzar excepcion por un supermercado no asociadoa una ciudad', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.domainName()
    });
 
    await expect(()=> service.findSupermarketFromCity(ciudad.id, nuevoSupermercado.id)).rejects.
    toHaveProperty("message", "El supermercado con el id dado no esta asociado a la ciudad");
  });

  it('findSupermarketsFromCity debe retornar los supermercados de una ciudad', async ()=>{
    const supermercados: SupermercadoEntity[] = await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(5)
  });

  it('findSupermarketsFromCity debe retornar una excepcion por una ciudad invalida', async () => {
    await expect(()=> service.findSupermarketsFromCity("0")).rejects.
    toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('updateSupermarketsFromCity debe actualizar el listado de supermercados de una ciudad', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.domainName()
    });
 
    const ciudadActualizada: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, [nuevoSupermercado]);
    expect(ciudadActualizada.supermercados.length).toBe(1);
 
    expect(ciudadActualizada.supermercados[0].nombre).toBe(nuevoSupermercado.nombre);
    expect(ciudadActualizada.supermercados[0].longitud).toBe(nuevoSupermercado.longitud);
    expect(ciudadActualizada.supermercados[0].latitud).toBe(nuevoSupermercado.latitud);
    expect(ciudadActualizada.supermercados[0].paginaWeb).toBe(nuevoSupermercado.paginaWeb);
  });

  it('updateSupermarketsFromCity debe lanzar una excepcion por una ciudad invalida', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.domainName()
    });
 
    await expect(()=> service.updateSupermarketsFromCity("0", [nuevoSupermercado])).rejects.
    toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('updateSupermarketsFromCity debe lanzar una excepcion por un supermercado invalido', async () => {
    const nuevoSupermercado: SupermercadoEntity = listaSupermercados[0];
    nuevoSupermercado.id = "0";
 
    await expect(()=> service.updateSupermarketsFromCity(ciudad.id, [nuevoSupermercado])).rejects.
    toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('deleteSupermarketFromCity debe remover un supermercado de una ciudad', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
   
    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);
 
    const ciudadAlmacenada: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ["supermercados"]});
    const supermercadoBorrado: SupermercadoEntity = ciudadAlmacenada.supermercados.find(a => a.id === supermercado.id);
 
    expect(supermercadoBorrado).toBeUndefined();
 
  });

  it('deleteSupermarketFromCity debe lanzar una excepcion por un supermercado invalido', async () => {
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, "0")).rejects.
    toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('deleteSupermarketFromCity debe lanzar una excepcion por una ciudad invalida', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    await expect(()=> service.deleteSupermarketFromCity("0", supermercado.id)).rejects.
    toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('deleteSupermarketFromCity debe lanzar una excepcion por un supermercado no asociado', async () => {
    const nuevoSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.domainName()
    });
 
    await expect(()=> service.deleteSupermarketFromCity(ciudad.id, nuevoSupermercado.id)).rejects.
    toHaveProperty("message", "El supermercado con el id dado no esta asociado a la ciudad");
  });
 

});
