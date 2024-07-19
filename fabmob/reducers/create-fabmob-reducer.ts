import update from 'immutability-helper'

export interface CommunautoStation {
  id: string
  latitude: number
  longitude: number
  name: string
  no: string
  sector: string
  zone: string
}

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
  Ville?: string
  adresse?: string
  // eslint-disable-next-line camelcase
  adresse_for_Nominatim: string
}

interface FabmobState {
  communautoStations: CommunautoStation[]
  touristicPlaces: TouristicPlace[]
}

export function getFabmobInitialState(config: unknown): FabmobState {
  return {
    communautoStations: [],
    touristicPlaces: []
  }
}

function createFabmobReducer(config: unknown): unknown {
  const initialState = getFabmobInitialState(config)

  return (state = initialState, action: any) => {
    switch (action.type) {
      case 'SET_COMMUNAUTO_STATIONS': {
        return update(state, {
          communautoStations: { $set: action.payload }
        })
      }

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
