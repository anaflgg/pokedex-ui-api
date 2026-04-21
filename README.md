# Pokedex UI API 🧩
![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

> Pokédex interativa que consome dados da API oficial de Pokémon, exibindo cards dinâmicos com busca em tempo real, carregamento progressivo e suporte a dark mode.

### ✨ [Veja o site ao vivo aqui!](https://anaflgg.github.io/pokedex-ui-api/)

---

### 📸 Screenshots

#### 💻 Desktop (Light Mode)
![Desktop Screenshot](./assets/img/print-desktop.png)

#### 📱 Mobile (Dark Mode)
![Mobile Screenshot](./assets/img/print-mobile.png)

---

### 📖 Sobre o Projeto
Projeto de Pokédex desenvolvido com JavaScript puro consumindo dados da PokeAPI. A aplicação exibe os Pokémon em formato de cards com cores dinâmicas baseadas no tipo, permitindo buscar por nome ou número, carregar mais resultados sob demanda e alternar entre tema claro e escuro (dark mode).

---

### 🔌 Integração com API
Os dados são consumidos da PokeAPI através de requisições HTTP. Inicialmente é feita uma chamada para listar os Pokémon com paginação, e em seguida são realizadas requisições adicionais para obter os detalhes individuais de cada Pokémon, como tipos, imagens e identificação.

---

### ⚙️ Como funciona
- A aplicação busca uma lista de Pokémon utilizando paginação (`limit` e `offset`)
- Para cada Pokémon, uma nova requisição é feita para obter seus detalhes completos
- Os dados são processados e renderizados dinamicamente no DOM
- Cada card armazena informações usando `dataset`
- A busca filtra os Pokémon em tempo real com base no nome ou número
- O usuário pode alternar entre tema claro e escuro (dark mode)

---

### 🚀 Tecnologias Utilizadas
- HTML5
- CSS3 (Tailwind CSS)
- JavaScript
- PokeAPI

---

### 🧠 Aprendizados
- Consumo de API com `fetch` e uso de `async/await`
- Manipulação e renderização dinâmica do DOM
- Uso de `Promise.all` para múltiplas requisições
- Implementação de busca em tempo real
- Uso de `dataset` para armazenar dados nos elementos HTML
- Estilização com Tailwind CSS
- Implementação de dark mode com manipulação de classes
- Controle de estado com paginação (offset)

---

### 🐛 Desafios e Soluções
- A busca não retornava o Pokémon correto devido ao uso de índice incorreto. Resolvido utilizando `dataset` diretamente nos elementos HTML.
- Sincronização de múltiplas requisições da API. Resolvido com `Promise.all`.
- Controle de carregamento progressivo dos dados. Resolvido utilizando paginação com `offset`.

---

### 📝 Atualizações Futuras
Melhorias e novas funcionalidades serão adicionadas em breve conforme evolução do projeto.

---

### 👷 Como executar o projeto
Projeto estático, não precisa instalar nada.

1. Clone o repositório:
```bash
git clone https://github.com/anaflgg/pokedex-ui-api.git