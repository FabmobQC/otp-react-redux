import { createAction } from 'redux-actions'

import { assembleBasePath } from '../../lib/actions/api'

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
