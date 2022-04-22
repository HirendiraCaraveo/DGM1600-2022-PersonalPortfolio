const getAPIData = async (url) => {
  try {
    const result = await fetch(url)
    return await result.json()
  } catch (error) {
    console.error(error)
  }
}

class Pokemon {
  constructor(name, height, weight, abilities, types) {
    ;(this.id = 9001),
      (this.name = name),
      (this.height = height),
      (this.weight = weight),
      (this.abilities = abilities),
      (this.types = types)
  }
}

const pokeHeader = document.querySelector('header')
const pokeGrid = document.querySelector('.pokegrid')
const newButton = document.createElement('button')
newButton.textContent = 'New Pokemon'
pokeHeader.appendChild(newButton)
newButton.addEventListener('click', () => {
  const pokeName = prompt('What is the name of your new Pokemon?', 'Irhemon')
  const pokeHeight = prompt("What is the Pokemon's height?", 80)
  const pokeWeight = prompt("What is the Pokemon's weight?", 2400)
  const pokeAbilities = prompt(
    "What are your Pokemon's abilities? (use a comma separated list)",
  )
  const pokeTypes = prompt(
    "What are your Pokemon's types? (up to 2 types separated by a space)",
  )

  const newPokemon = new Pokemon(
    pokeName,
    pokeHeight,
    pokeWeight,
    makeAbilitiesArray(pokeAbilities),
    makeTypesArray(pokeTypes),
  )
  console.log(newPokemon)
  populatePokeCard(newPokemon)
})

const Button = document.querySelector('Button')
Button.addEventListener('click', () => {
  const allByType = getAllPokemonByType('water')
  allByType.forEach((item) => populatePokeCard(item))
})


function makeAbilitiesArray(commaString) {
  // example comma string 'run-away, gluttony'
  return commaString.split(',').map((abilityName) => {
    return { ability: { name: abilityName } }
  })
}

function makeTypesArray(spacedString) {
  // example spaced string 'poison flying'
  return spacedString.split(' ').map((typeName) => {
    return { type: { name: typeName } }
  })
}

const loadedPokemon = []

async function loadPokemon(offset = 0, limit = 25) {
  const data = await getAPIData(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`,
  )
  for (const nameAndUrl of data.results) {
    const singlePokemon = await getAPIData(nameAndUrl.url)
    const simplifiedPokemon = {
      id: singlePokemon.id,
      height: singlePokemon.height,
      weight: singlePokemon.weight,
      name: singlePokemon.name,
      abilities: singlePokemon.abilities,
      types: singlePokemon.types,
      moves: singlePokemon.moves.slice(0, 3),
    }
    loadedPokemon.push(simplifiedPokemon)
    populatePokeCard(simplifiedPokemon)
  }
}

function populatePokeCard(pokemon) {
  const pokeScene = document.createElement('div')
  pokeScene.className = 'scene'
  const pokeCard = document.createElement('div')
  pokeCard.className = 'card'
  pokeCard.addEventListener('click', () =>
    pokeCard.classList.toggle('is-flipped'),
  )
  // populate the front of the card
  pokeCard.appendChild(populateCardFront(pokemon))
  pokeCard.appendChild(populateCardBack(pokemon))
  pokeScene.appendChild(pokeCard)
  pokeGrid.appendChild(pokeScene)
}

function populateCardFront(pokemon) {
  const pokeFront = document.createElement('figure')
  pokeFront.className = 'cardFace front'

  const pokeType = pokemon.types[0].type.name
  //const pokeType2 = pokemon.types[1]?.type.name
  // console.log(pokeType, pokeType2)
  pokeFront.style.setProperty('background', getPokeTypeColor(pokeType))

 /*  if(pokeType2) {
    pokeFront.style.setProperty('background', `linear-gradient(${getPokeTypeColor(pokeType)}, ${getPokeTypeColor(pokeType2)})`)
  } */

  const pokeImg = document.createElement('img')
  if (pokemon.id === 9001) {
    pokeImg.src = '../images/pokeball.png'
  } else {
    pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  }
  const pokeCaption = document.createElement('figcaption')
  pokeCaption.textContent = pokemon.name

  pokeFront.appendChild(pokeImg)
  pokeFront.appendChild(pokeCaption)
  return pokeFront
}

function populateCardBack(pokemon) {
  const pokeBack = document.createElement('div')
  pokeBack.className = 'cardFace back'
  const label = document.createElement('h4')
  label.textContent = 'Abilities'
  const label1 = document.createElement('h4')
  label1.textContent = 'Types'
  pokeBack.appendChild(label)


  const abilityList = document.createElement('ul')
  pokemon.abilities.forEach((abilityItem) => {
    const listItem = document.createElement('li')
    listItem.textContent = abilityItem.ability.name
    abilityList.appendChild(listItem)
  })
  const typeslist = document.createElement('ul')
  pokemon.types.forEach((pokeType) => {
    const typeItem = document.createElement('li')
    typeItem.textContent = pokeType.type.name
    typeslist.appendChild(typeItem)
  })
  pokeBack.appendChild(abilityList)
  pokeBack.appendChild(label1)
  pokeBack.appendChild(typeslist)

  return pokeBack
}


function typesBackground(pokemon, card) {
  let pokeType1 = pokemon.types[0].type.name
  let pokeType2 = pokemon.types[1]?.type.name
  
  if(!pokeType2) {
    card.style.setProperty('background', getPokeTypeColor(pokeType1))
  } else {
     card.style.setProperty(
      'background',
      `linear-gradient(${getPokeTypeColor(pokeType1)}, ${getPokeTypeColor(
        pokeType2,
      )})`,
    )
  }
}
function getPokeTypeColor(pokeType) {
  // if(pokeType === 'grass') return '#00FF00'
  let color
  switch (pokeType) {
    case 'grass':
      color = '#78C850'
      break
    case 'fire':
      color = '#F08030'
      break
    case 'water':
      color = '#6890F0'
      break
    case 'bug':
      color = '#7FFF00'
      break
    case 'normal':
      color = '#F5F5DC'
      break
    case 'flying':
      color = '#00FFFF'
      break
    case 'poison':
      color = '#C300FF'
      break
    case 'electric':
      color = '#C8FF00'
      break
    case 'psychic':
      color = '#F85888'
      break
    case 'ground':
      color = '#E0C068'
      break
    case 'ghost':
      color = '#705898'
      break
    default:
      color = '#888888'
  }
  return color
}

function filterPokemonByType(type) {
  return loadedPokemon.filter((pokemon) => pokemon.types[0].type.name === type)
}

await loadPokemon(0, 50)

console.log(filterPokemonByType('grass'))
// not figured out yet what the UI might be for sorted/filtered pokemon...

