import update from 'immutability-helper'

export type AmenityType = 'Education' | 'Grocery Store' | 'Health center'

export interface Amenity {
  id: string
  latitude: number
  longitude: number
  name: string
  type: AmenityType
}

export interface CommunautoStation {
  id: string
  latitude: number
  longitude: number
  name: string
  no: string
  sector: string
  zone: string
}

export interface ParkAndRide {
  address: string
  description: string
  id: string
  latitude: number
  longitude: number
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

export interface FabmobState {
  administrativeRegions: string | undefined
  amenities: Amenity[]
  communautoStations: CommunautoStation[]
  isAmenitiesVisible: boolean
  isTouristicPlacesVisible: boolean
  parkAndRides: ParkAndRide[]
  touristicPlaces: TouristicPlace[]
  viewedRoutes: Set<string>
}

export function getFabmobInitialState(config: unknown): FabmobState {
  return {
    administrativeRegions: undefined,
    amenities: [],
    communautoStations: [],
    isAmenitiesVisible: false,
    isTouristicPlacesVisible: false,
    parkAndRides: [],
    touristicPlaces: [],
    viewedRoutes: new Set()
  }
}

function createFabmobReducer(config: unknown): unknown {
  const initialState = getFabmobInitialState(config)

  return (state = initialState, action: any) => {
    switch (action.type) {
      case 'SET_ADMINISTRATIVE_REGIONS': {
        return update(state, {
          administrativeRegions: { $set: action.payload }
        })
      }

      case 'SET_AMENITIES': {
        return update(state, {
          amenities: { $set: action.payload }
        })
      }

      case 'SET_IS_AMENITIES_VISIBLE': {
        return update(state, {
          isAmenitiesVisible: { $set: action.payload }
        })
      }

      case 'SET_COMMUNAUTO_STATIONS': {
        return update(state, {
          communautoStations: { $set: action.payload }
        })
      }

      case 'SET_PARK_AND_RIDES': {
        return update(state, {
          parkAndRides: { $set: action.payload }
        })
      }

      case 'SET_TOURISTIC_PLACES': {
        return update(state, {
          touristicPlaces: { $set: action.payload }
        })
      }

      case 'SET_IS_TOURISTIC_PLACES_VISIBLE': {
        return update(state, {
          isTouristicPlacesVisible: { $set: action.payload }
        })
      }

      case 'ADD_VIEWED_ROUTE': {
        const viewedRoutes = new Set(state.viewedRoutes)
        viewedRoutes.add(action.payload)
        return update(state, {
          viewedRoutes: {
            $set: viewedRoutes
          }
        })
      }

      case 'TOGGLE_VIEWED_ROUTE': {
        const viewedRoutes = new Set(state.viewedRoutes)
        if (viewedRoutes.has(action.payload)) {
          viewedRoutes.delete(action.payload)
        } else {
          viewedRoutes.add(action.payload)
        }
        return update(state, {
          viewedRoutes: { $set: viewedRoutes }
        })
      }

      case 'CLEAR_VIEWED_ROUTES': {
        return update(state, {
          viewedRoutes: { $set: new Set<string>() }
        })
      }

      default:
        return state
    }
  }
}

export default createFabmobReducer
