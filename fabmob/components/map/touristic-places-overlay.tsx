import { connect } from 'react-redux'
import { MarkerWithPopup } from '@opentripplanner/base-map'
import React, { ReactElement, useState } from 'react'

import { fetchTouristicPlaces } from '../../actions/fabmob'
import { TouristicPlace } from '../../reducers/create-fabmob-reducer'

type TouristicPlacesOverlayProps = {
  fetchTouristicPlaces: () => void
  touristicPlaces: TouristicPlace[]
}

const TouristicPlacesOverlay = ({
  fetchTouristicPlaces,
  touristicPlaces
}: TouristicPlacesOverlayProps): ReactElement => {
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  if (isFirstLoad) {
    fetchTouristicPlaces()
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
  fetchTouristicPlaces
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TouristicPlacesOverlay)
