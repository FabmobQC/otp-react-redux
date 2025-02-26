import {
  Styled as BaseMapStyled,
  MarkerWithPopup
} from '@opentripplanner/base-map'
import { connect } from 'react-redux'
import FromToLocationPicker from '@opentripplanner/from-to-location-picker'
import React, { ReactElement, useState } from 'react'

import * as mapActions from '../../../lib/actions/map'
import { fetchTouristicPlaces } from '../../actions/fabmob'
import { TouristicPlace } from '../../reducers/create-fabmob-reducer'
import { TouristicPlaceIndicator } from '../../icons/touristic-places-indicator'
import { touristicPlacesColors } from '../../actions/ui-constants'

type TouristicPlacesOverlayProps = {
  fetchTouristicPlaces: () => void
  setLocation: (location: any) => void
  touristicPlaces: TouristicPlace[]
}

const TouristicPlacesOverlay = ({
  fetchTouristicPlaces,
  setLocation,
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
        <TouristicPlaceMarker
          key={place.place_id}
          setLocation={setLocation}
          touristicPlace={place}
        />
      ))}
    </>
  )
}

type TouristicPlaceProps = {
  setLocation: (location: any) => void
  touristicPlace: TouristicPlace
}

const TouristicPlaceMarker = ({
  setLocation,
  touristicPlace
}: TouristicPlaceProps): ReactElement => {
  const size = '10px'
  return (
    <MarkerWithPopup
      popupContents={
        <BaseMapStyled.MapOverlayPopup>
          {touristicPlace.name && (
            <BaseMapStyled.PopupTitle>
              {touristicPlace.name}
            </BaseMapStyled.PopupTitle>
          )}
          <BaseMapStyled.PopupRow>
            <div>
              {touristicPlace.housenumber && `${touristicPlace.housenumber}, `}{' '}
              {touristicPlace.street && `${touristicPlace.street}, `}{' '}
              {touristicPlace.city}
            </div>
            <FromToLocationPicker
              label
              location={{
                lat: touristicPlace.lat,
                lon: touristicPlace.lon,
                name: touristicPlace.name
              }}
              setLocation={setLocation}
            />
          </BaseMapStyled.PopupRow>
        </BaseMapStyled.MapOverlayPopup>
      }
      // @ts-expect-error popup props are incorrect
      popupProps={{ offset: 10 }}
      position={[touristicPlace.lat, touristicPlace.lon]}
    >
      <TouristicPlaceIndicator
        color={getTouristicPlaceColor(touristicPlace)}
        size={size}
      />
    </MarkerWithPopup>
  )
}

const getTouristicPlaceColor = (touristicPlace: TouristicPlace): string => {
  if (touristicPlace.categories.includes('religion')) {
    return touristicPlacesColors.religious
  } else if (
    touristicPlace.categories.includes('leisure.park') ||
    touristicPlace.categories.includes('natural') ||
    touristicPlace.categories.includes('tourism.attraction.viewpoint')
  ) {
    return touristicPlacesColors.natural
  } else if (
    touristicPlace.categories.includes('tourism.attraction.artwork') ||
    touristicPlace.categories.includes('tourism.sights.memorial')
  ) {
    return touristicPlacesColors.art
  }

  return touristicPlacesColors.default
}

const mapStateToProps = (state: any) => {
  const { touristicPlaces } = state.fabmob
  return {
    touristicPlaces
  }
}

const mapDispatchToProps = {
  fetchTouristicPlaces,
  setLocation: mapActions.setLocation
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TouristicPlacesOverlay)
