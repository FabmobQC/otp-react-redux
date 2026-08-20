import {
  Styled as BaseMapStyled,
  MarkerWithPopup
} from '@opentripplanner/base-map'
import { connect } from 'react-redux'
import React, { ReactElement, useState } from 'react'

import * as mapActions from '../../../lib/actions/map'
import { fetchParkAndRides } from '../../actions/fabmob'
import { ParkAndRide } from '../../reducers/create-fabmob-reducer'
import { ParkAndRideIndicator } from '../../icons/park-and-ride-indicator'
import { stripHtml } from '../../utils/strip-html'
import FromToLocationPicker from '../../@opentripplanner/from-to-location-picker'

type ParkAndRideOverlayProps = {
  fetchParkAndRides: () => void
  parkAndRides: ParkAndRide[]
  setLocation: (location: any) => void
}

const ParkAndRideOverlay = ({
  fetchParkAndRides,
  parkAndRides,
  setLocation
}: ParkAndRideOverlayProps): ReactElement => {
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  if (isFirstLoad) {
    fetchParkAndRides()
    setIsFirstLoad(false)
  }
  return (
    <>
      {parkAndRides.map((parkAndRide) => (
        <ParkAndRideMarker
          key={parkAndRide.id}
          parkAndRide={parkAndRide}
          setLocation={setLocation}
        />
      ))}
    </>
  )
}

type ParkAndRideMarkerProps = {
  parkAndRide: ParkAndRide
  setLocation: (location: any) => void
}

const ParkAndRideMarker = ({
  parkAndRide,
  setLocation
}: ParkAndRideMarkerProps): ReactElement => {
  const size = '20px'
  return (
    <MarkerWithPopup
      popupContents={
        <BaseMapStyled.MapOverlayPopup>
          <BaseMapStyled.PopupTitle>
            {parkAndRide.address}
          </BaseMapStyled.PopupTitle>
          <BaseMapStyled.PopupRow>
            <div style={{ whiteSpace: 'pre-line' }}>
              {stripHtml(parkAndRide.description)}
            </div>
            <FromToLocationPicker
              label
              location={{
                lat: parkAndRide.latitude,
                lon: parkAndRide.longitude,
                name: parkAndRide.address
              }}
              setLocation={setLocation}
            />
          </BaseMapStyled.PopupRow>
        </BaseMapStyled.MapOverlayPopup>
      }
      // @ts-expect-error popup props are incorrect
      popupProps={{ offset: 10 }}
      position={[parkAndRide.latitude, parkAndRide.longitude]}
    >
      <ParkAndRideIndicator size={size} />
    </MarkerWithPopup>
  )
}

const mapStateToProps = (state: any) => {
  const { parkAndRides } = state.fabmob
  return {
    parkAndRides
  }
}

const mapDispatchToProps = {
  fetchParkAndRides,
  setLocation: mapActions.setLocation
}

export default connect(mapStateToProps, mapDispatchToProps)(ParkAndRideOverlay)
