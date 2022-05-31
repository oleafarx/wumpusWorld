//Se crea el mapa con arrays. 
const mapa = Array(4);
mapa[0] = Array(4);
mapa[1] = Array(4);
mapa[2] = Array(4);
mapa[3] = Array(4);
mapa[0][0] = "";
mapa[0][1] = "Hedor";
mapa[0][2] = "Wumpus";
mapa[0][3] = "Hedor";
mapa[1][0] = "Brisa";
mapa[1][1] = "";
mapa[1][2] = "Oro";
mapa[1][3] = "";
mapa[2][0] = "Pozo";
mapa[2][1] = "Brisa";
mapa[2][2] = "Pozo";
mapa[2][3] = "Brisa";
mapa[3][0] = "Brisa";
mapa[3][1] = "";
mapa[3][2] = "Brisa";
mapa[3][3] = "Pozo";

//Array con las posiciones de los pozos y Wumpus
let posiblePozo = [];
let posibleWumpu = [];

//Array con los caminos recorridos
let recorrido = [];

//Zonas seguras sin Wumpus ni pozos
let sinWumpus = [];
let sinPozos = [];

//Constantes de acciones
const opcionesValidas = ["movArriba", "movDerecha", "movAbajo", "movIzquierda"];
const direcciones = ["arriba", "derecha", "abajo", "izquierda"];
const acciones = {

    //Funciones de movimiento hacia arriba, derecha, abajo, izquierda
    movArriba: (x,y) => {
        if( (y + 1 ) <= 3 ){
            return [x, y + 1];
        }
        else{
            return [-1, -1];
        }
    },

    movDerecha: (x,y) => {
        if( (x + 1 ) <= 3 ){
            return [x + 1, y];
        }
        else{
            return [-1, -1];
        }
    },

    movAbajo: (x,y) => {
        if( (y - 1 ) <= 3 ){
            return [x, y - 1];
        }
        else{
            return [-1, -1];
        }
    },

    movIzquierda: (x,y) => {
        if( (x - 1 ) <= 3 ){
            return [x - 1, y];
        }
        else{
            return [-1, -1];
        }
    },

    //Función disparar si encuentra al Wumpus
    disparar: (x, y, direccion) => {
        switch(direccion){
            case "derecha":
                x = x + 1;
            break;
            case "izquierda":
                x = x - 1;
            break;
            case "arriba":
                y = y + 1;
            break;
            case "abajo":
                y = y - 1;
            break;
        }
        console.log("Tiro dirigido a: " + direccion + " - En las coordenadas X:" + (x + 1) + " Y: "+ (y + 1));
        if(mapa[x][y] == "Wumpus"){
            return true
        }
        else{
            return false;
        }
    },

    //Función si encuentra el oro
    encontrarOro: (x, y) => {
        if(mapa[x][y] == "Oro"){
            return true;
        }
        else{
            return false;
        }
    }
}

//Funciones auxiliares
const existeArray = (array, x, y) => {
    let retorno = -1;

    array.forEach( (value, index) => {
        if(value[0] == x && value[1] == y ){
            retorno = index;
            return
        }
    } );
    return retorno;
}

//Funcion que evalua si una posición tiene altas posibilidades de tener Wumpus
const sumarPeligro = (tipo, x, y) => {
    let keys = [];
    let retorno;

    //Recorremos el array de opciones validas y validamos nuestras acciones posibles
    opcionesValidas.forEach(opcion => {
        retorno = acciones[opcion](x,y);

        //Si hay un camino valido y no lo hemos recorrido, lo agregamos a peligro posible
        if(retorno[0] != -1 && existeArray(recorrido, retorno[0], retorno[1] == -1)){
            if(tipo == "Wumpus"){

                //Solo agregamos al Array de Wumpus solo si se el script sabe que no es una zona segura
                if( existeArray(sinWumpus,  retorno[0], retorno[1]) == -1 ){
                    let key = existeArray(posibleWumpu,  retorno[0], retorno[1]);
                    console.log(`Riesgo de Wumpus en X: ${(retorno[0] + 1)} Y: ${(retorno[1] + 1)}`);

                    if(key == -1){
                        //Agregamos la dirección de posible Wumpus a nuestro array
                        posibleWumpu.push( retorno[0], retorno[1], 1);
                    }
                    else{
                        //Sumamos una evidencia más de que el Wumpu existe en esa posición
                        posibleWumpu[key][2] += 1;
                        keys.push(key);
                    }
                }
                else {
                    console.log(`Peligro no agregado, zona segura de Wumpus en  X: ${(retorno[0] + 1)} Y: ${(retorno[1] + 1)}`);
                }
            }
            else{
                //Solo agregamos al Array de Pozos solo si se el script sabe que no es una zona segura
                if( existeArray(sinPozos,  retorno[0], retorno[1]) == -1 ){
                    if(existeArray(posiblePozo, retorno[0], retorno[1]) == -1 ){
                        console.log(`Riesgo de Pozo en X: ${(retorno[0] + 1)} Y: ${(retorno[1] + 1)}`);
                        posiblePozo.push( retorno[0], retorno[1]);
                    }
                }
                else{
                    console.log(`Peligro no agregado, zona segura de Pozos en  X: ${(retorno[0] + 1)} Y: ${(retorno[1] + 1)}`);
                }
            }
        }
    });
    return keys;
}