const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
const selectedPokemons = [];
function toggleSelection(pokemon){
  const index = selectedPokemons.findIndex(p => p.id == pokemon.id);
  if(index == -1){
    if(selectedPokemons.length < 6){
      selectedPokemons.push(pokemon);
    } 
    else{
      alert('Sua pokedex está um pokecheia!');
    }
  } 
  else{
    selectedPokemons.splice(index, 1);
  }
  AtualizacaoPokemon(pokemon);
}
function AtualizacaoPokemon(pokemon){
  const pokemonDiv = document.getElementById(`pokemon-${pokemon.id}`);
  const imgElement = pokemonDiv.querySelector('.pokemon-image');
  if(selectedPokemons.find(p => p.id == pokemon.id)){
    pokemonDiv.classList.add('selected');
    imgElement.classList.add('selected-image');
  } 
  else{
    pokemonDiv.classList.remove('selected');
    imgElement.classList.remove('selected-image');
  }
}
async function AllPokemon(url){
  const container = document.getElementById('pokemonContainer');
  try{
    let nextUrl = url;
    while (nextUrl){
      const response = await fetch(nextUrl);
      if(!response.ok){
        throw new Error(`Erro: ${response.status}`);
      }
      const data = await response.json();
      const pokemons = data.results;
    for(const pokemon of pokemons){
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        if(pokemonData.id < 152){
          const pokemonElement = displayPokemon(pokemonData);
          container.appendChild(pokemonElement);
        }
    }
        nextUrl = data.next;
    }
  } 
  catch(error){
    console.error('Voce saiu da cidade de Pallet, tente uma outra rota', error);
  }
}
function displayPokemon(pokemon){
  const pokemonDiv = document.createElement('div');
  pokemonDiv.classList.add('pokemon');
  pokemonDiv.id = `pokemon-${pokemon.id}`;
  pokemonDiv.style.cursor = 'pointer'; 
  pokemonDiv.addEventListener('click', () => toggleSelection(pokemon));
  const imageUrl = pokemon.sprites.front_default;
  const imgElement = document.createElement('img');
  imgElement.src = imageUrl;
  imgElement.classList.add('pokemon-image');
  pokemonDiv.appendChild(imgElement);
  const nameElement = document.createElement('p');
  nameElement.textContent = `Pokemon: ${pokemon.name}`;
  pokemonDiv.appendChild(nameElement);
  const typeElement = document.createElement('p');
  typeElement.textContent = `Tipo: ${pokemon.types.map(type => type.type.name).join(', ')}`;
  pokemonDiv.appendChild(typeElement);
  let isGrass = false;
  pokemon.types.forEach(type =>{
    const typeClass = type.type.name.toLowerCase();
    pokemonDiv.classList.add(typeClass);
    if(type.type.name == 'grass'){
      isGrass = true;
    }
  });
  if(isGrass){
    pokemonDiv.classList.remove('poison');
  }
  return pokemonDiv;
}
AllPokemon(apiUrl);
function adicionarPokemons(){
  if(selectedPokemons.length > 0){
    const dialog = document.createElement('div');
    dialog.classList.add('pokemon-dialog');
    selectedPokemons.forEach(pokemon =>{
      const pokemonInfo = document.createElement('div');
      pokemonInfo.innerHTML = ` <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Pokemon: ${pokemon.name}</p>
        <p>Tipe: ${pokemon.types.map(type => type.type.name).join(', ')}</p>`;
      dialog.appendChild(pokemonInfo);
    });
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;'; 
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', fimAlerta);
    dialog.appendChild(closeButton);
    document.body.appendChild(dialog);
    function fimAlerta(){
      document.body.removeChild(dialog);
    }
  } 
  else{
    alert('Selecione algum pokemon!!');
  }
}