
const listaPokemon = document.querySelector("#listaPokemon");
const pageNum = document.querySelector("#pageNum");
const previousBtn = document.querySelector("#previousBtn");
const nextBtn = document.querySelector("#nextBtn");

let offset = 0; //indica desde qué Pokémon empieza la página
let currentPage = 1; //número de la página actual
const limit = 20; //numero de pokemon por página

const URL = "https://pokeapi.co/api/v2/pokemon/";

function getPokeCleared(apiUrl) {
    listaPokemon.innerHTML = ""; // limpiar tarjetas
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            //obtener informacion completa x fetch
            const promises = data.results.map(pokemon => fetch(pokemon.url).then(r => r.json()));
            Promise.all(promises).then(allPokes => {
                allPokes.forEach(poke => mostrarPokemon(poke));
            });
        });
}

function pagination() {
    pageNum.textContent = currentPage;

    previousBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            offset -= limit;
            pageNum.textContent = currentPage;
            getPokeCleared(`${URL}?offset=${offset}&limit=${limit}`);
        }
    });

    nextBtn.addEventListener("click", () => {
        currentPage++;
        offset += limit;
        pageNum.textContent = currentPage;
        getPokeCleared(`${URL}?offset=${offset}&limit=${limit}`);
    });

    // Cargar la primera página
    getPokeCleared(`${URL}?offset=${offset}&limit=${limit}`);
}

pagination(); // activar la paginación


function mostrarPokemon(poke) {

    //tipo (elemento) del pokemon
    const tipos = poke.types.map((type) => type.type.name);
    //crear HTML para el tipo
    const tipoHtml = tipos.map((type) => `<p class="${type} tipo">${type.toUpperCase()}</p>`).join('');
    
    //formatea el ID con ceros a la izquierda
    let pokeId = poke.id.toString().padStart(3, '0');

    //Crear div para las tarjetas
    const div = document.createElement("div");
    div.classList.add("pokemon");

    if (tipos.length === 1) {
        //Si es 1 tipo, dejar color estatico 
        // - obtener valor de variable css con getCS
        div.style.backgroundColor = getComputedStyle(document.documentElement)
            .getPropertyValue(`--type-${tipos[0]}`);
        //Si son 2 tipos, aplicar animacion de colores 
        // añadir clase para la animacion
        } else if (tipos.length === 2) {
        const color1 = getComputedStyle(document.documentElement)
            .getPropertyValue(`--type-${tipos[0]}`);
        const color2 = getComputedStyle(document.documentElement)
            .getPropertyValue(`--type-${tipos[1]}`);

        div.classList.add("pokemon-animado");
        div.style.setProperty('--color-primario', color1);
        div.style.setProperty('--color-secundario', color2);
    }

    // extraer habilidades sin indicar si son ocultas
    const habilidades = poke.abilities
    .map(hab => hab.ability.name)
    .join(', ');


    div.innerHTML = `
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["showdown"].front_default}" alt="${poke.name}">
        </div>
            <div class="pokemon-tipos">
                ${tipoHtml}
            </div>

            <div class= "pokemon-abilities">
            <p class= "abilitie">${habilidades}</p>
            <div>

            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>

            

        </div>
    `;

    listaPokemon.append(div);
}


