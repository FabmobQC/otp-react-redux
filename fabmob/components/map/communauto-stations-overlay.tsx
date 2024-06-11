import {
  Styled as BaseMapStyled,
  MarkerWithPopup
} from '@opentripplanner/base-map'
import { connect } from 'react-redux'
import React, { ReactElement, useState } from 'react'

import * as mapActions from '../../../lib/actions/map'
import { CommunautoLogo } from '../../icons/communauto-logo'
import { CommunautoStation } from '../../reducers/create-fabmob-reducer'
import { fetchCommunautoStations } from '../../actions/fabmob'
import FromToLocationPicker from '../../@opentripplanner/from-to-location-picker'

type CommunautoStationsOverlayProps = {
  communautoStations: CommunautoStation[]
  fetchCommunautoStations: () => void
  setLocation: (location: any) => void
}

const CommunautoStationsOverlay = ({
  communautoStations,
  fetchCommunautoStations,
  setLocation
}: CommunautoStationsOverlayProps): ReactElement => {
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  if (isFirstLoad) {
    fetchCommunautoStations()
    setIsFirstLoad(false)
  }
  return (
    <>
      {communautoStations.map((station) => (
        <CommunautoStationMarker
          communautoStation={station}
          key={station.id}
          setLocation={setLocation}
        />
      ))}
    </>
  )
}

type CommunautoStationProps = {
  communautoStation: CommunautoStation
  setLocation: (location: any) => void
}

const CommunautoStationMarker = ({
  communautoStation,
  setLocation
}: CommunautoStationProps): ReactElement => {
  return (
    <MarkerWithPopup
      popupContents={
        <BaseMapStyled.MapOverlayPopup>
          <BaseMapStyled.PopupTitle>
            {communautoStation.name}
          </BaseMapStyled.PopupTitle>
          <BaseMapStyled.PopupRow>
            <div>{communautoStation.name}</div>
            <FromToLocationPicker
              label
              location={{
                lat: communautoStation.latitude,
                lon: communautoStation.longitude,
                name: communautoStation.name
              }}
              setLocation={setLocation}
            />
          </BaseMapStyled.PopupRow>
        </BaseMapStyled.MapOverlayPopup>
      }
      // @ts-expect-error popup props are incorrect
      popupProps={{ offset: 10 }}
      position={[communautoStation.latitude, communautoStation.longitude]}
    >
      <CommunautoLogo size={20} />
    </MarkerWithPopup>
  )
}

const mapStateToProps = (state: any) => {
  const { communautoStations } = state.fabmob
  return {
    communautoStations
  }
}

const mapDispatchToProps = {
  fetchCommunautoStations,
  setLocation: mapActions.setLocation
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunautoStationsOverlay)
