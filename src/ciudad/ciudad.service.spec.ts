import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let listaCiudades: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity),);

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    listaCiudades = [];
    for(let i = 0; i < 5; i++){
        const ciudad: CiudadEntity = await repository.save({
        nombre: faker.address.cityName(),
        pais: faker.address.country(),
        habitantes: faker.datatype.number()})
        listaCiudades.push(ciudad);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las ciudades', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(listaCiudades.length);
  });

  it('findOne debe retornar una ciudad por id', async () => {
    const ciudadAlmacenada: CiudadEntity = listaCiudades[0];
    const ciudad: CiudadEntity = await service.findOne(ciudadAlmacenada.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(ciudadAlmacenada.nombre)
    expect(ciudad.pais).toEqual(ciudadAlmacenada.pais)
    expect(ciudad.habitantes).toEqual(ciudadAlmacenada.habitantes)
  });

  it('findOne debe lanzar una excepcion por una ciudad invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La cuidad no fue encontrada")
  });

  it('create debe retornar una nueva ciudad', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.address.cityName(),
      pais: "Argentina",
      habitantes: faker.datatype.number(),
      supermercados: []
    }
 
    const nuevaCiudad: CiudadEntity = await service.create(ciudad);
    expect(nuevaCiudad).not.toBeNull();
 
    const ciudadAlmacenada: CiudadEntity = await repository.findOne({where: {id: nuevaCiudad.id}})
    expect(ciudadAlmacenada).not.toBeNull();
    expect(ciudadAlmacenada.nombre).toEqual(nuevaCiudad.nombre)
    expect(ciudadAlmacenada.pais).toEqual(nuevaCiudad.pais)
    expect(ciudadAlmacenada.habitantes).toEqual(nuevaCiudad.habitantes)
  });

  it('create debe lanzar excepcion si el pais no esta en el conjunto de paises dado', async () => {
    const ciudad: CiudadEntity = {
      id: "",
      nombre: faker.address.cityName(),
      pais: faker.address.country(),
      habitantes: faker.datatype.number(),
      supermercados: []
    }
    await expect(() => service.create(ciudad)).rejects.toHaveProperty("message", "El pais no pertenece al listado Argentina, Ecuador o Paraguay")
  });

  it('update debe modificar una ciudad', async () => {
    const ciudad: CiudadEntity = listaCiudades[0];
    ciudad.nombre = "quito";
    ciudad.pais = "Ecuador";

    const ciudadActualizada: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(ciudadActualizada).not.toBeNull();

    const ciudadAlmacenada: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(ciudadAlmacenada).not.toBeNull();
    expect(ciudadAlmacenada.nombre).toEqual(ciudad.nombre)
    expect(ciudadAlmacenada.pais).toEqual(ciudad.pais)
  });

  it('update debe lanzar excepcion si el pais no esta en el conjunto de paises dado', async () => {
    let ciudad: CiudadEntity = listaCiudades[0];
    ciudad = {
      ...ciudad, nombre: "pitalito", pais: "Colombia"
    }

    await expect(() => service.update(ciudad.id, ciudad)).rejects.toHaveProperty("message", "El pais no pertenece al listado Argentina, Ecuador o Paraguay");
  });

  it('update debe lanzar una excepcion por una ciudad invalida', async () => {
    let ciudad: CiudadEntity = listaCiudades[0];
    ciudad = {
      ...ciudad, nombre: "Buenos Aires", pais: "Argentina"
    }
    await expect(() => service.update("0", ciudad)).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada")
  });

  it('delete debe eliminar una ciudad', async () => {
    const ciudad: CiudadEntity = listaCiudades[0];
    await service.delete(ciudad.id);
     const ciudadBorrada: CiudadEntity = await repository.findOne({ where: { id: ciudad.id } })
    expect(ciudadBorrada).toBeNull();
  });

  it('delete debe lanzar una excepcion por una ciudad invalida', async () => {
    const ciudad: CiudadEntity = listaCiudades[0];
    await service.delete(ciudad.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada")
  });

});
