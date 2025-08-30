document.addEventListener('DOMContentLoaded', () => {
    const inputSearch = document.getElementById('input-search');
    const searchBtn = document.getElementById('search-btn');
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    const pokemonInfo = document.getElementById('pokemon-info');
    const btnNavigation = document.querySelector('.btn-navigation');
    const pokemonImage = document.getElementById('pokemon-image');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonDescription = document.getElementById('pokemon-description');
    const errorMessage = document.getElementById('error-message');
    const loadingMessage = document.getElementById('loading-message');
    let currentPokemonID = 1;

    const fetchPokemon = async (pokemonID) => { //requisição assíncrona para a PokeAPI
        showLoadingMessage();
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
            if (!response.ok) throw new error('error 404 -Pokemon not found');
            const pokemon = await response.json();
            fillPokemonInfo(pokemon);
            errorMessage.classList.add('hidden');
            hideLoading();
            pokemonInfo.classList.remove('hidden');
            btnNavigation.classList.remove('hidden');
        } catch (error) {
            showError();
        } finally {

        }
    };

    const fillPokemonInfo = (pokemon) => { //preenche as informações do Pokémon na tela
        pokemonImage.src = pokemon['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        pokemonName.textContent = `${pokemon.name} (ID: ${pokemon.id})`;
        pokemonDescription.textContent = `
        Height: ${pokemon.height / 10}m
        | Weight: ${pokemon.weight / 10}kg
        | Type: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}`;
        currentPokemonID = pokemon.id;
        disableBackButton();
    }

    const showLoadingMessage = () => { //mostra a mensagem de carregamento
        loadingMessage.classList.remove('hidden');
        pokemonInfo.classList.add('hidden');
        errorMessage.classList.add('hidden');
        btnNavigation.classList.add('hidden');
    };

    const hideLoading = () => {       //esconde a mensagem de carregamento
        loadingMessage.classList.add('hidden');
    };

    const showError = () => { //mostra a mensagem de erro
        pokemonName.textContent = '';
        pokemonDescription.textContent = '';
        pokemonImage.src = '';
        pokemonInfo.classList.add('hidden');
        btnNavigation.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        loadingMessage.classList.add('hidden');
    };

    const disableBackButton = () => { //desabilita o botão de voltar se o ID do Pokémon for 1 ou menor
        backBtn.disabled = (currentPokemonID <= 1);
    };

    const disableSearch = () => {   //desabilita o botão de busca se o campo de entrada estiver vazio
        searchBtn.disabled = !inputSearch.value.trim();
    };

    searchBtn.addEventListener('click', () => {
        const query = inputSearch.value.trim().toLowerCase();
        if (query) {
            fetchPokemon(query);
        };
    });

    inputSearch.addEventListener('input', disableSearch);

    inputSearch.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchBtn.click();
        };
    });

    backBtn.addEventListener('click', () => {
        if (currentPokemonID > 1) {
            fetchPokemon(currentPokemonID - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        fetchPokemon(currentPokemonID + 1);
    });

    fetchPokemon(currentPokemonID);
    disableSearch();

});