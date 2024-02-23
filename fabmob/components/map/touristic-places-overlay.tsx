import { connect } from 'react-redux'
import { MarkerWithPopup } from '@opentripplanner/base-map'
import React, { ReactElement, useState } from 'react'

import { assembleBasePath } from '../../../lib/actions/api'
import { setTouristicPlaces } from '../../actions/fabmob'
import { TouristicPlace } from '../../reducers/create-fabmob-reducer'

export const loadTouristicPlaces = (): unknown => {
  return async (dispatch: any, getState: any): Promise<void> => {
    const state = getState()
    const { config } = state.otp

    const url = `${assembleBasePath(config)}/touristic-places`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })
    const data = await response.json()
    dispatch(setTouristicPlaces(data.touristicPlaces))
  }
}

type TouristicPlacesOverlayProps = {
  loadTouristicPlaces: () => void
  touristicPlaces: TouristicPlace[]
}

const TouristicPlacesOverlay = ({
  loadTouristicPlaces,
  touristicPlaces
}: TouristicPlacesOverlayProps): ReactElement => {
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  if (isFirstLoad) {
    loadTouristicPlaces()
    setIsFirstLoad(false)
  }
  return (
    <>
      {touristicPlaces.map((place) => (
        <TouristicPlaceMarker key={place.place_id} touristicPlace={place} />
      ))}
    </>
  )
}

type TouristicPlaceProps = {
  touristicPlace: TouristicPlace
}

const TouristicPlaceMarker = ({
  touristicPlace
}: TouristicPlaceProps): ReactElement => {
  return (
    <MarkerWithPopup position={[touristicPlace.lat, touristicPlace.lon]}>
      {touristicPlace.name}
    </MarkerWithPopup>
  )
}

const mapStateToProps = (state: any) => {
  const { touristicPlaces } = state.fabmob
  return {
    touristicPlaces
  }
}

const mapDispatchToProps = {
  loadTouristicPlaces
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TouristicPlacesOverlay)
