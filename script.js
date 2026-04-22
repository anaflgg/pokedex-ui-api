const LIMITE = 20;
let offset = 0;
let todosPokemon = [];

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

function renderizarCards(lista) {
    lista.forEach(pokemon => {
        const tipo = pokemon.types[0].type.name;
        const corFundo = coresTipo[tipo] || 'bg-gray-400';
        const numero = String(pokemon.id).padStart(3, '0');
        const card = document.createElement('div');

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

    card.dataset.id = pokemon.id;
    
    card.addEventListener('click', () => {
        const id = card.dataset.id;
        const pokemonClicado = todosPokemon.find(p => p.id === Number(id));
        abrirModal(pokemonClicado);
    })
    });
}

async function buscarEspecies(id) {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const dados = await resposta.json();
    return dados;
}

async function abrirModal(pokemon) {
    const modal = document.getElementById('modal');
    const conteudo = document.getElementById('modalConteudo');

    conteudo.innerHTML = `<p class="text-center text-gray-400 py-8">Carregando...</p>`;
    modal.classList.remove('hidden');

    const especies = await buscarEspecies(pokemon.id);
    const geracao = especies.generation.name.replace('generation-', 'Gen ').toUpperCase();
    const regiao = especies.generation.name
        .replace('generation-i', 'Kanto').replace('generation-ii', 'Johto')
        .replace('generation-iii', 'Hoenn').replace('generation-iv', 'Sinnoh')
        .replace('generation-v', 'Unova').replace('generation-vi', 'Kalos')
        .replace('generation-vii', 'Alola').replace('generation-viii', 'Galar')
        .replace('generation-ix', 'Paldea');

    const tipo = pokemon.types[0].type.name;
    const corFundo = coresTipo[tipo] || 'bg-gray-400';
    const numero = String(pokemon.id).padStart(3, '0');

    const spriteAnimado = pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default
        || pokemon.sprites.other['official-artwork'].front_default;

    const coresStat = ['#4ade80', '#fb923c', '#60a5fa', '#c084fc', '#34d399', '#f472b6'];
    const nomesStat = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];

    const stats = pokemon.stats.map((s, i) => `
        <div style="margin-bottom: 7px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px;">
                <span class="text-gray-500">${nomesStat[i]}</span>
                <span class="font-medium dark:text-white">${s.base_stat}</span>
            </div>
            <div class="bg-gray-200 dark:bg-gray-700" style="border-radius: 99px; height: 6px; overflow: hidden;">
                <div style="height: 100%; width: ${Math.round(s.base_stat / 150 * 100)}%; background: ${coresStat[i]}; border-radius: 99px;"></div>
            </div>
        </div>
    `).join('');

    conteudo.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; border-radius: 1rem; overflow: hidden;">

            <div class="${corFundo}" style="flex: 0 0 190px; min-width: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem 1rem; gap: 6px;">
                <span style="font-size: 12px; color: rgba(255,255,255,0.65); font-family: monospace; align-self: flex-end;">#${numero}</span>
                <img src="${spriteAnimado}" alt="${pokemon.name}" style="width: 110px; height: 110px; object-fit: contain; image-rendering: pixelated;">
                <p style="color: white; font-weight: 600; font-size: 18px; margin: 0; text-transform: capitalize;">${pokemon.name}</p>
                <div style="display: flex; gap: 6px;">
                    ${pokemon.types.map(t => `
                        <span style="background: rgba(255,255,255,0.2); color: white; font-size: 11px; padding: 2px 10px; border-radius: 99px;">${t.type.name}</span>
                    `).join('')}
                </div>
                <div style="margin-top: 8px; display: flex; gap: 16px; text-align: center;">
                    <div>
                        <p style="color: rgba(255,255,255,0.6); font-size: 10px; margin: 0;">Altura</p>
                        <p style="color: white; font-size: 13px; font-weight: 500; margin: 0;">${(pokemon.height / 10).toFixed(1)}m</p>
                    </div>
                    <div>
                        <p style="color: rgba(255,255,255,0.6); font-size: 10px; margin: 0;">Peso</p>
                        <p style="color: white; font-size: 13px; font-weight: 500; margin: 0;">${(pokemon.weight / 10).toFixed(1)}kg</p>
                    </div>
                </div>
            </div>

            <div class="dark:bg-gray-800" style="flex: 1; min-width: 200px; padding: 1.25rem; background: white;">
                <div style="display: flex; gap: 8px; margin-bottom: 1rem; flex-wrap: wrap;">
                    <div class="dark:bg-gray-700" style="background: #f3f4f6; border-radius: 8px; padding: 6px 12px;">
                        <p style="color: #6b7280; font-size: 11px; margin: 0;">Geração</p>
                        <p class="dark:text-white" style="font-weight: 500; font-size: 13px; margin: 0;">${geracao}</p>
                    </div>
                    <div class="dark:bg-gray-700" style="background: #f3f4f6; border-radius: 8px; padding: 6px 12px;">
                        <p style="color: #6b7280; font-size: 11px; margin: 0;">Região</p>
                        <p class="dark:text-white" style="font-weight: 500; font-size: 13px; margin: 0;">${regiao}</p>
                    </div>
                    <div class="dark:bg-gray-700" style="background: #f3f4f6; border-radius: 8px; padding: 6px 12px;">
                        <p style="color: #6b7280; font-size: 11px; margin: 0;">Exp. base</p>
                        <p class="dark:text-white" style="font-weight: 500; font-size: 13px; margin: 0;">${pokemon.base_experience}</p>
                    </div>
                </div>

                <p style="font-size: 11px; font-weight: 500; color: #9ca3af; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">Stats</p>
                ${stats}

                <button id="fecharModal" class="bg-red-600 hover:bg-red-700 text-white" style="margin-top: 12px; width: 100%; border: none; border-radius: 99px; padding: 8px; font-size: 13px; font-weight: 500; cursor: pointer;">Fechar</button>
            </div>
        </div>
    `;

    document.getElementById('fecharModal').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });
}

btnDark.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
})

inputBusca.addEventListener('input', () => {
    const termo = inputBusca.value.toLowerCase().trim();
    grid.querySelectorAll('div').forEach((card, i) => {
        const p = todosPokemon[i];
        if (!p) return;
        const bate = p.name.includes(termo) || String(p.id).includes(termo);
        card.style.display = bate ? '' : 'none';
    });
});

btnCarregarMais.addEventListener('click', buscarPokemon);

buscarPokemon();





