import {IsNotEmpty, IsString, IsNumber} from 'class-validator';

export class SupermercadoDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly latitud: string;

    @IsString()
    @IsNotEmpty()
    readonly longitud: string;

    @IsString()
    @IsNotEmpty()
    readonly paginaWeb: string;
}
