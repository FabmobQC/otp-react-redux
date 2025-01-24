import {
  Styled as BaseMapStyled,
  MarkerWithPopup
} from '@opentripplanner/base-map'
import { connect } from 'react-redux'
import FromToLocationPicker from '../../@opentripplanner/from-to-location-picker'
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
      {touristicPlaces.map((place, index) => (
        <TouristicPlaceMarker
          key={index}
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
          {touristicPlace['Nom activité'] && (
            <BaseMapStyled.PopupTitle>
              {touristicPlace['Nom activité']}
            </BaseMapStyled.PopupTitle>
          )}
          <BaseMapStyled.PopupRow>
            <div>
              {touristicPlace['Adresse OSM'] ??
                touristicPlace.adresse ??
                touristicPlace.adresse_for_Nominatim}
            </div>
            <FromToLocationPicker
              label
              location={{
                lat: touristicPlace.Latitude,
                lon: touristicPlace.Longitude,
                name: touristicPlace['Nom activité']
              }}
              setLocation={setLocation}
            />
          </BaseMapStyled.PopupRow>
        </BaseMapStyled.MapOverlayPopup>
      }
      // @ts-expect-error popup props are incorrect
      popupProps={{ offset: 10 }}
      position={[touristicPlace.Latitude, touristicPlace.Longitude]}
    >
      <TouristicPlaceIndicator
        color={getTouristicPlaceColor(touristicPlace)}
        size={size}
      />
    </MarkerWithPopup>
  )
}

// eslint-disable-next-line complexity
const getTouristicPlaceColor = (touristicPlace: TouristicPlace): string => {
  switch (touristicPlace.Catégorie) {
    case 'Attraction':
      return touristicPlacesColors.attraction
    case 'Culture':
      return touristicPlacesColors.culture
    case 'Hébergement':
      return touristicPlacesColors.accommodation
    case 'Magasinage':
      return touristicPlacesColors.shopping
    case 'Musée':
      return touristicPlacesColors.museum
    case 'Nature':
      return touristicPlacesColors.nature
    case 'Patrimoine historique':
      return touristicPlacesColors.historical
    case 'Patrimoine religieux':
      return touristicPlacesColors.religious
    case 'Restaurant / bar':
      return touristicPlacesColors.restaurant
    case 'Spa / détente':
      return touristicPlacesColors.relaxation
    case 'Spectacle / festival':
      return touristicPlacesColors.showFestival
    case 'Tour organisé':
      return touristicPlacesColors.organizedTour
    default:
      return touristicPlacesColors.default
  }
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
