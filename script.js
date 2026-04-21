const LIMITE = 20;
let offset = 0;
let todosPokemon = [];
let listaTodos = [];
let buscando = false;

const grid = document.getElementById('pokemonGrid');
const btnCarregarMais = document.getElementById('loadMore');
const inputBusca = document.getElementById('searchInput');
const btnDark = document.getElementById('darkToggle');

const coresTipo = {
  fire: 'bg-orange-400',    water: 'bg-blue-400',
  grass: 'bg-green-400',   electric: 'bg-yellow-400',
  psychic: 'bg-pink-400',  ice: 'bg-cyan-400',
  dragon: 'bg-indigo-500', dark: 'bg-gray-700',
  fairy: 'bg-pink-300',    fighting: 'bg-red-700',
  flying: 'bg-sky-400',    poison: 'bg-purple-500',
  ground: 'bg-yellow-600', rock: 'bg-yellow-800',
  bug: 'bg-lime-500',      ghost: 'bg-purple-800',
  steel: 'bg-slate-400',   normal: 'bg-gray-400',
};

async function carregarListaCompleta() {
    try {
        const resposta = await fetch(
            'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0'
        );
        const dados = await resposta.json();
        listaTodos = dados.results;
    } catch (erro) {
        console.error('Erro ao carregar lista completa:', erro);
    }
}

async function buscarPokemon() {
    btnCarregarMais.textContent = 'Carregando...'
    btnCarregarMais.disabled = true;

    try {
        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=${LIMITE}&offset=${offset}`
        );
        const dados = await resposta.json();

        const detalhes = await Promise.all(
        dados.results.map(p => fetch(p.url).then(r => r.json()))
        );
        
        todosPokemon = [...todosPokemon, ...detalhes];
        renderizarCards(detalhes);
        offset += LIMITE;
    
    } catch (erro) {
    console.error('Erro ao buscar pokémons:', erro);
    }
    btnCarregarMais.textContent = 'Carregar mais';
    btnCarregarMais.disabled = false;
}

async function buscarPorTermo(termo) {
    grid.innerHTML = '';

    if (listaTodos.length === 0) {
        grid.innerHTML = `<p class="text-gray-500 col-span-full text-center">Carregando lista...</p>`;
        await carregarListaCompleta();
    }

    const encontrados = listaTodos.filter(p => {
        const id = p.url.split('/').filter(Boolean).pop();
        return p.name.includes(termo) || id === termo;
    });

    if (encontrados.length === 0) {
        grid.innerHTML = `<p class="text-gray-500 col-span-full text-center">Nenhum pokémon encontrado.</p>`;
        return;
    }

    try {
        const detalhes = await Promise.all(
            encontrados.slice(0, 20).map(p => fetch(p.url).then(r => r.json()))
        );
        renderizarCards(detalhes);
    } catch (erro) {
        console.error('Erro ao buscar detalhes:', erro)
    }
}

function renderizarCards(lista) {
    lista.forEach(pokemon => {
        const tipo = pokemon.types[0].type.name;
        const corFundo = coresTipo[tipo] || 'bg-gray-400';
        const numero = String(pokemon.id).padStart(3, '0');
        const card = document.createElement('div');

        card.dataset.name = pokemon.name;
        card.dataset.id = pokemon.id;

        card.className = `
        ${corFundo} rounded-2xl p-4 flex flex-col items-center
        cursor-pointer hover:scale-105 transition-transform duration-200
        shadow-md text-white
        `;

        card.innerHTML = `
        <span class="self-end text-xs opacity-70 font-mono">#${numero}</span>
        <img
            src="${pokemon.sprites.other['official-artwork'].front_default}"
            alt="${pokemon.name}"
            class="w-24 h-24 drop-shadow-lg"
        >
        <p class="mt-2 font-bold capitalize">${pokemon.name}</p>
        <div class="flex gap-1 mt-1">
            ${pokemon.types.map(t => `
            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                ${t.type.name}
            </span>
            `).join('')}
        </div>
        `;

    grid.appendChild(card);
    });
}

btnDark.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
})

inputBusca.addEventListener('input', () => {
    const termo = inputBusca.value.toLowerCase().trim();

    if (!termo) {
        buscando = false;
        btnCarregarMais.disabled = false;
        grid.innerHTML = '';
        if (todosPokemon.length === 0) {
            buscarPokemon();
        } else {
            renderizarCards(todosPokemon);
        }
        return;
    }

    buscando = true;
    btnCarregarMais.disabled = true;
    buscarPorTermo(termo);
});

btnCarregarMais.addEventListener('click', () => {
    if (!buscando) buscarPokemon();
});

carregarListaCompleta().then(() => buscarPokemon());





