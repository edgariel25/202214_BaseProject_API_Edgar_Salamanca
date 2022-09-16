/**
 * el metodo valida que un Pais se encuentre en un listado determinado.
 * 
 * true si se encuentra
 * false si no se encuentra*/
export function validateCountry(country: string): boolean{
    const countrys = Object.values(Countrys);
    
    for (const country_ of countrys){
        if(country_ === country)
            return true;
    }
    return false;
}

export enum Countrys{
    ARGENTINA = "Argentina", 
    ECUADOR = "Ecuador", 
    PARAGUAY = "Paraguay"
}