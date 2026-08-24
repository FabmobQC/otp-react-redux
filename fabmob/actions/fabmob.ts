import { createAction } from 'redux-actions'

import { assembleBasePath } from '../../lib/actions/api'

export const setAdministrativeRegions = createAction(
  'SET_ADMINISTRATIVE_REGIONS'
)

export const fetchAdministrativeRegions = (): unknown => {
  return async (dispatch: any, getState: any): Promise<void> => {
    const state = getState()
    const { config } = state.otp

    const url = `${assembleBasePath(config)}/administrative-regions`

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })
      const data = await response.json()
      dispatch(setAdministrativeRegions(data))
    } catch (error) {
      console.error('Error fetching administrative regions', error)
    }
  }
}

export const setAmenities = createAction('SET_AMENITIES')

export const fetchAmenities = (): unknown => {
  return async (dispatch: any, getState: any): Promise<void> => {
    const state = getState()
    const { config } = state.otp

    const url = `${assembleBasePath(config)}/amenities`

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })
      const data = await response.json()
      dispatch(setAmenities(data.amenities))
    } catch (error) {
      console.error('Error fetching amenities', error)
    }
  }
}

export const setIsAmenitiesVisible = createAction('SET_IS_AMENITIES_VISIBLE')

export const setCommunautoStations = createAction('SET_COMMUNAUTO_STATIONS')

export const fetchCommunautoStations = (): unknown => {
  return async (dispatch: any, getState: any): Promise<void> => {
    const state = getState()
    const { config } = state.otp

    const url = `${assembleBasePath(config)}/communauto-stations?cityId=${
      config.fabmob.communautoCityIds ?? ''
    }`

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })
      const data = await response.json()
      dispatch(setCommunautoStations(data.communautoStations))
    } catch (error) {
      console.error('Error fetching Communauto stations', error)
    }
  }
}

export const setParkAndRides = createAction('SET_PARK_AND_RIDES')

export const fetchParkAndRides = (): unknown => {
  return async (dispatch: any, getState: any): Promise<void> => {
    const state = getState()
    const { config } = state.otp

    const url = `${assembleBasePath(config)}/park-and-rides`

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })
      const data = await response.json()
      dispatch(setParkAndRides(data.parkAndRides))
    } catch (error) {
      console.error('Error fetching park and rides', error)
    }
  }
}

export const setTouristicPlaces = createAction('SET_TOURISTIC_PLACES')

export const fetchTouristicPlaces = (): unknown => {
  return async (dispatch: any, getState: any): Promise<void> => {
    const state = getState()
    const { config } = state.otp

    const url = `${assembleBasePath(config)}/touristic-places`

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })
      const data = await response.json()
      dispatch(setTouristicPlaces(data.touristicPlaces))
    } catch (error) {
      console.error('Error fetching touristic places', error)
    }
  }
}

export const setIsTouristicPlacesVisible = createAction(
  'SET_IS_TOURISTIC_PLACES_VISIBLE'
)

export const settingAdditionalPlaceWaitingTime = createAction(
  'SET_ADDITIONAL_PLACE_WAITING_TIME'
)

export const setAdditionalPlaceWaitingTime = (
  index: number,
  waitingTime: number
): unknown => {
  return (dispatch: any): void => {
    dispatch(settingAdditionalPlaceWaitingTime({ index, waitingTime }))
  }
}

export const clearingAdditionalPlaceWaitingTime = createAction(
  'CLEAR_ADDITIONAL_PLACE_WAITING_TIME'
)

export const clearAdditionalPlaceWaitingTime = (index: number): unknown => {
  return (dispatch: any): void => {
    dispatch(clearingAdditionalPlaceWaitingTime({ index }))
  }
}

export const addViewedRoute = createAction('ADD_VIEWED_ROUTE')

export const toggleViewedRoute = createAction('TOGGLE_VIEWED_ROUTE')

export const clearViewedRoutes = createAction('CLEAR_VIEWED_ROUTES')
