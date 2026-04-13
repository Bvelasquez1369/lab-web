const botonBuscar = document.getElementById('botonBuscar');
const entradaPokemon = document.getElementById('nombrePokemon');
const contenedorResultado = document.getElementById('contenedorResultado');
const imagenPokemon = document.getElementById('imagenPokemon');
const nombrePokemonMostrado = document.getElementById('nombrePokemonMostrado');
const botonGuardarFavorito = document.getElementById('botonGuardarFavorito');
const listaFavoritos = document.getElementById('listaFavoritos');
const botonEliminarUno = document.getElementById('botonEliminarUno');
const botonEliminarTodos = document.getElementById('botonEliminarTodos');

let pokemonActual = null;

function mostrarError(mensaje) {
    alert(`⚠️ ${mensaje}`);
}

async function buscarPokemon() {
    const nombre = entradaPokemon.value.trim().toLowerCase();
    if (nombre === '') {
        mostrarError('Escribe el nombre de un Pokémon.');
        return;
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${nombre}`;

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error('Pokémon no encontrado');
        const datos = await respuesta.json();

        pokemonActual = {
            nombre: datos.name,
            urlImagen: datos.sprites.front_default
        };

        imagenPokemon.src = pokemonActual.urlImagen;
        imagenPokemon.alt = pokemonActual.nombre;
        nombrePokemonMostrado.textContent = pokemonActual.nombre;
        contenedorResultado.style.display = 'block';
    } catch (error) {
        mostrarError(error.message);
        contenedorResultado.style.display = 'none';
        pokemonActual = null;
    }
}

function guardarFavorito() {
    if (!pokemonActual) {
        mostrarError('Busca un Pokémon antes de guardarlo.');
        return;
    }

    let favoritos = localStorage.getItem('misFavoritosPokemon');
    favoritos = favoritos ? JSON.parse(favoritos) : [];

    const yaExiste = favoritos.some(fav => fav.nombre === pokemonActual.nombre);
    if (yaExiste) {
        mostrarError(`${pokemonActual.nombre} ya está en favoritos.`);
        return;
    }

    favoritos.push(pokemonActual);
    localStorage.setItem('misFavoritosPokemon', JSON.stringify(favoritos));
    mostrarFavoritos();
    alert(`✅ ${pokemonActual.nombre} guardado como favorito.`);
}

function mostrarFavoritos() {
    let favoritos = localStorage.getItem('misFavoritosPokemon');
    favoritos = favoritos ? JSON.parse(favoritos) : [];
    listaFavoritos.innerHTML = '';

    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = `<div class="col-12 text-center text-white fs-4">No tiene favoritos</div>`;
        return;
    }

    favoritos.forEach((pokemon, indice) => {
        const columna = document.createElement('div');
        columna.className = 'col-md-3 col-sm-6';

        columna.innerHTML = `
            <div class="card-favorito p-2 text-center position-relative">
                <button class="boton-eliminar-favorito" data-indice="${indice}">✖</button>
                <img src="${pokemon.urlImagen}" class="img-fluid" alt="${pokemon.nombre}" style="max-width: 100px; margin: 10px auto;">
                <h5 class="mt-2 fw-bold">${pokemon.nombre}</h5>
            </div>
        `;

        listaFavoritos.appendChild(columna);
    });

    document.querySelectorAll('.boton-eliminar-favorito').forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.stopPropagation();
            const indice = parseInt(boton.getAttribute('data-indice'));
            eliminarUnFavorito(indice);
        });
    });
}

function eliminarUnFavorito(indice) {
    let favoritos = localStorage.getItem('misFavoritosPokemon');
    favoritos = favoritos ? JSON.parse(favoritos) : [];
    if (indice >= 0 && indice < favoritos.length) {
        const eliminado = favoritos.splice(indice, 1);
        localStorage.setItem('misFavoritosPokemon', JSON.stringify(favoritos));
        mostrarFavoritos();
        alert(`🗑️ ${eliminado[0].nombre} eliminado de favoritos.`);
    }
}

function eliminarUltimoFavorito() {
    let favoritos = localStorage.getItem('misFavoritosPokemon');
    favoritos = favoritos ? JSON.parse(favoritos) : [];
    if (favoritos.length === 0) {
        mostrarError('No hay favoritos para eliminar.');
        return;
    }
    const eliminado = favoritos.pop();
    localStorage.setItem('misFavoritosPokemon', JSON.stringify(favoritos));
    mostrarFavoritos();
    alert(`🗑️ ${eliminado.nombre} eliminado.`);
}

function eliminarTodosFavoritos() {
    if (confirm('⚠️ ¿Estás seguro de que quieres eliminar TODOS tus Pokémon favoritos?')) {
        localStorage.removeItem('misFavoritosPokemon');
        mostrarFavoritos();
        alert('Todos los favoritos han sido eliminados.');
    }
}

botonBuscar.addEventListener('click', buscarPokemon);
botonGuardarFavorito.addEventListener('click', guardarFavorito);
botonEliminarUno.addEventListener('click', eliminarUltimoFavorito);
botonEliminarTodos.addEventListener('click', eliminarTodosFavoritos);
entradaPokemon.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarPokemon();
});

mostrarFavoritos();