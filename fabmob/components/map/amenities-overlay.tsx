import {
  Styled as BaseMapStyled,
  MarkerWithPopup
} from '@opentripplanner/base-map'
import { connect } from 'react-redux'
import React, { ReactElement, useState } from 'react'

import * as mapActions from '../../../lib/actions/map'
import { Amenity } from '../../reducers/create-fabmob-reducer'
import { AmenityIndicator } from '../../icons/amenity-indicator'
import { fetchAmenities } from '../../actions/fabmob'
import FromToLocationPicker from '../../@opentripplanner/from-to-location-picker'

type AmenitiesOverlayProps = {
  amenities: Amenity[]
  fetchAmenities: () => void
  setLocation: (location: any) => void
}

const AmenitiesOverlay = ({
  amenities,
  fetchAmenities,
  setLocation
}: AmenitiesOverlayProps): ReactElement => {
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  if (isFirstLoad) {
    fetchAmenities()
    setIsFirstLoad(false)
  }
  return (
    <>
      {amenities.map((amenity) => (
        <AmenityMarker
          amenity={amenity}
          key={amenity.id}
          setLocation={setLocation}
        />
      ))}
    </>
  )
}

type AmenityMarkerProps = {
  amenity: Amenity
  setLocation: (location: any) => void
}

const AmenityMarker = ({
  amenity,
  setLocation
}: AmenityMarkerProps): ReactElement => {
  const size = '20px'
  return (
    <MarkerWithPopup
      popupContents={
        <BaseMapStyled.MapOverlayPopup>
          <BaseMapStyled.PopupTitle>{amenity.name}</BaseMapStyled.PopupTitle>
          <BaseMapStyled.PopupRow>
            <FromToLocationPicker
              label
              location={{
                lat: amenity.latitude,
                lon: amenity.longitude,
                name: amenity.name
              }}
              setLocation={setLocation}
            />
          </BaseMapStyled.PopupRow>
        </BaseMapStyled.MapOverlayPopup>
      }
      // @ts-expect-error popup props are incorrect
      popupProps={{ offset: 10 }}
      position={[amenity.latitude, amenity.longitude]}
    >
      <AmenityIndicator amenityType={amenity.type} size={size} />
    </MarkerWithPopup>
  )
}

const mapStateToProps = (state: any) => {
  const { amenities } = state.fabmob
  return {
    amenities
  }
}

const mapDispatchToProps = {
  fetchAmenities,
  setLocation: mapActions.setLocation
}

export default connect(mapStateToProps, mapDispatchToProps)(AmenitiesOverlay)
