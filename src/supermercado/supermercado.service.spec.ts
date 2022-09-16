import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';
import { faker } from '@faker-js/faker';


describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let listaSupermercados: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity),);
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    listaSupermercados = [];
    for(let i = 0; i < 5; i++){
        const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        longitud: faker.lorem.sentence(),
        latitud: faker.address.secondaryAddress(),
        paginaWeb: faker.address.city()})
        listaSupermercados.push(supermercado);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todos los supermercados', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(listaSupermercados.length);
  });

  it('findOne debe retornar un supermercado por id', async () => {
    const supermercadoAlmacenado: SupermercadoEntity = listaSupermercados[0];
    const supermercado: SupermercadoEntity = await service.findOne(supermercadoAlmacenado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(supermercadoAlmacenado.nombre)
    expect(supermercado.latitud).toEqual(supermercadoAlmacenado.latitud)
    expect(supermercado.longitud).toEqual(supermercadoAlmacenado.longitud)
    expect(supermercado.paginaWeb).toEqual(supermercadoAlmacenado.paginaWeb)
  });

  it('findOne debe lanzar una excepcion por un supermercado invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El supermercado no fue encontrado")
  });

  it('create debe retornar un nuevo supermercado', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      longitud: faker.lorem.sentence(),
      latitud: faker.address.secondaryAddress(),
      paginaWeb: faker.address.city(),
      ciudades: []
    }
 
    const nuevoSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(nuevoSupermercado).not.toBeNull();
 
    const supermercadoAlmacenado: SupermercadoEntity = await repository.findOne({where: {id: nuevoSupermercado.id}})
    expect(supermercadoAlmacenado).not.toBeNull();
    expect(supermercadoAlmacenado.nombre).toEqual(nuevoSupermercado.nombre)
    expect(supermercadoAlmacenado.longitud).toEqual(nuevoSupermercado.longitud)
    expect(supermercadoAlmacenado.latitud).toEqual(nuevoSupermercado.latitud)
    expect(supermercadoAlmacenado.paginaWeb).toEqual(nuevoSupermercado.paginaWeb)
  })

  it('create debe lanzar excepcion si el tamaño del campo nombre del nuevo supermercado es menor a 10 caracteres', async () => {
    const supermercado: SupermercadoEntity = {
      id: "",
      nombre: "vipMenu",
      longitud: faker.lorem.sentence(),
      latitud: faker.address.secondaryAddress(),
      paginaWeb: faker.address.city(),
      ciudades: []
    }
    await expect(() => service.create(supermercado)).rejects.toHaveProperty("message", "El nombre del supermercado debe ser de mas de 10 caracteres")
  })

  it('update debe modificar un supermercado', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    supermercado.nombre = "santa lechona";
    supermercado.longitud = "70° N";
     const supermercadoActualizado: SupermercadoEntity = await service.update(supermercado.id, supermercado);
    expect(supermercadoActualizado).not.toBeNull();
     const supermercadoAlmacenado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(supermercadoAlmacenado).not.toBeNull();
    expect(supermercadoAlmacenado.nombre).toEqual(supermercado.nombre)
    expect(supermercadoAlmacenado.longitud).toEqual(supermercado.longitud)
  });

  it('update debe lanzar una excepcion si el tamaño del campo nombre del supermercado es menor a 10 caracteres', async () => {
    let supermercado: SupermercadoEntity = listaSupermercados[0];
    supermercado = {
      ...supermercado, nombre: "vip", longitud: "66° S"
    }

    await expect(() => service.update(supermercado.id, supermercado)).rejects.toHaveProperty("message", "El nombre del supermercado debe ser de mas de 10 caracteres");
  });

  it('update debe lanzar una excepcion por un supermercado invalido', async () => {
    let supermercado: SupermercadoEntity = listaSupermercados[0];
    supermercado = {
      ...supermercado, nombre: "vip parrilla", longitud: "66° S"
    }
    await expect(() => service.update("0", supermercado)).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado")
  });

  it('delete debe eliminar un supermercado', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    await service.delete(supermercado.id);
     const supermercadoBorrado: SupermercadoEntity = await repository.findOne({ where: { id: supermercado.id } })
    expect(supermercadoBorrado).toBeNull();
  });

  it('delete debe lanzar una excepcion por un supermercado invalido', async () => {
    const supermercado: SupermercadoEntity = listaSupermercados[0];
    await service.delete(supermercado.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado")
  });

});
