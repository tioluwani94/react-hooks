// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    error: null,
    status: 'idle',
    pokemon: null,
  })

  React.useEffect(() => {
    if (!pokemonName) return
    setState(state => ({...state, status: 'pending'}))
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState(state => ({
          ...state,
          status: 'resolved',
          pokemon: pokemonData,
        }))
      })
      .catch(e => {
        setState(state => ({...state, error: e, status: 'rejected'}))
      })
  }, [pokemonName])

  switch (state.status) {
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />
    case 'rejected':
      throw state.error
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    default:
      return 'Submit a pokemon'
  }
}

const ErroFallback = ({error, resetErrorBoundary}) => (
  <div role="alert">
    <p>{error.message}</p>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
)

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          fallbackRender={ErroFallback}
          onReset={() => setPokemonName('')}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
