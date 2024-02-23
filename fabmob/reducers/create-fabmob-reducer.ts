import update from 'immutability-helper'

export interface TouristicPlace {
  lat: number
  lon: number
  name: string
  // eslint-disable-next-line camelcase
  place_id: string
}

interface FabmobState {
  touristicPlaces: TouristicPlace[]
}

export function getFabmobInitialState(config: unknown): FabmobState {
  return {
    touristicPlaces: []
  }
}

function createFabmobReducer(config: unknown): unknown {
  const initialState = getFabmobInitialState(config)

  return (state = initialState, action: any) => {
    switch (action.type) {
      case 'SET_TOURISTIC_PLACES': {
        return update(state, {
          touristicPlaces: { $set: action.payload }
        })
      }

      default:
        return state
    }
  }
}

export default createFabmobReducer
