const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const main = document.querySelector("main")

// 1. get poke trainers with all pokemon by fetching
// 2. append pokemon card to main div

getCards()

function getCards() {
  fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(cards => {
      makeTrainers(cards)
    })
}

function makeTrainers(cards) {
  cards.forEach(card => {
    const mainCardDiv = document.createElement("div")
    mainCardDiv.className = "card"
    mainCardDiv.dataset.id = card.id

    const ptag = document.createElement("p")
    ptag.innerText = card.name

    const pokeBtn = document.createElement("button")
    pokeBtn.dataset.trainerId = card.id
    pokeBtn.innerText = "Add Pokemon"
    pokeBtn.className = "add-poke"

    const ul = document.createElement("ul")
    ul.className = "pokeUL"
    ul.id = `ul-${card.id}`

    card.pokemons.forEach(pokemon => {
      createPokeLi(pokemon, ul)
    })
    mainCardDiv.append(ptag)
    mainCardDiv.append(pokeBtn)
    mainCardDiv.append(ul)
    main.append(mainCardDiv)
  })
}

function createPokeLi(pokemon, ul) {
  const li = document.createElement("li")
  li.id = `pokemon-${pokemon.id}`
  li.innerHTML = `${pokemon.nickname} (${pokemon.species}) 
        <button class="release" data-pokemon-id="${
          pokemon.id
        }">Release</button>`
  ul.append(li)
}

main.addEventListener("click", handleButtons)

function handleButtons(e) {
  if (e.target.className === "add-poke") {
    const trainerId = e.target.dataset.trainerId
    let pokemonCount = e.target.parentElement.childNodes[2].childNodes.length
    if (pokemonCount < 6) {
      addPokemon(trainerId)
    }
  }
  if (e.target.className === "release") {
    const pokeMonId = e.target.dataset.pokemonId
    deletePokemon(pokeMonId)
  }
}

function deletePokemon(pokeId) {
    fetch(POKEMONS_URL + `/${pokeId}`, {
        method: "DELETE"
    }).then(res => res.json())
    .then(pokemon => {
        let li = document.getElementById(`pokemon-${pokemon.id}`)
        li.remove()
    })
}


function addPokemon(trainerId) {
  fetch(POKEMONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      trainer_id: trainerId
    })
  })
    .then(res => res.json())
    .then(pokemon => {
      console.log(pokemon.trainer_id)
      let ul = document.getElementById(`ul-${pokemon.trainer_id}`)
      createPokeLi(pokemon, ul)
    })
}
