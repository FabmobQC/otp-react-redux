import update from 'immutability-helper'

export type TouristicPlaceCategorie =
  | 'Patrimoine religieux'
  | 'Hébergement'
  | 'Restaurant / bar'
  | 'Magasinage'
  | 'Nature'
  | 'Spectacle / festival'
  | 'Tour organisé'
  | 'Patrimoine historique'
  | 'Musée'
  | 'Spa / détente'
  | 'Culture'
  | 'Attraction'

export interface TouristicPlace {
  'Adresse OSM'?: string
  Catégorie: TouristicPlaceCategorie
  Latitude: number
  Longitude: number
  'Nom activité': string
  Ville: string
  adresse?: string
  // eslint-disable-next-line camelcase
  adresse_for_Nominatim: string
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
