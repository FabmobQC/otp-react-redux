import { connect } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import React, { ReactElement } from 'react'

import { AmenityIndicator } from '../../icons/amenity-indicator'
import { AmenityType } from '../../reducers/create-fabmob-reducer'
import { AppReduxState } from '../../../lib/util/state-types'
import { CommunautoLogo } from '../../icons/communauto-logo'
import { ParkAndRideIndicator } from '../../icons/park-and-ride-indicator'
import { setIsAmenitiesVisible } from '../../actions/fabmob'

interface LegendItem {
  amenityType: AmenityType
  label: string
}

const legendItems: LegendItem[] = [
  {
    amenityType: 'Education',
    label: 'components.AmenitiesViewer.legendEducation'
  },
  {
    amenityType: 'Grocery Store',
    label: 'components.AmenitiesViewer.legendGroceryStore'
  },
  {
    amenityType: 'Health center',
    label: 'components.AmenitiesViewer.legendHealthCenter'
  }
]

const LegendItem = ({
  amenityType,
  label
}: {
  amenityType: AmenityType
  label: string
}) => {
  const intl = useIntl()
  return (
    <div style={{ alignItems: 'center', display: 'flex', padding: '10px' }}>
      <AmenityIndicator amenityType={amenityType} size="30px" />
      <div style={{ width: '10px' }} />
      <div>{intl.formatMessage({ id: label })}</div>
    </div>
  )
}

const CommunautoItem = () => {
  const intl = useIntl()
  return (
    <div style={{ alignItems: 'center', display: 'flex', padding: '10px' }}>
      <CommunautoLogo size={30} />
      <div style={{ width: '10px' }} />
      <div>
        {intl.formatMessage({
          id: 'components.AmenitiesViewer.legendCommunauto'
        })}
      </div>
    </div>
  )
}

const ParkAndRideItem = () => {
  const intl = useIntl()
  return (
    <div style={{ alignItems: 'center', display: 'flex', padding: '10px' }}>
      <ParkAndRideIndicator size="30px" />
      <div style={{ width: '10px' }} />
      <div>
        {intl.formatMessage({
          id: 'components.AmenitiesViewer.legendParkAndRide'
        })}
      </div>
    </div>
  )
}

interface AmenitiesViewProps {
  isAmenitiesVisible: boolean
  setIsAmenitiesVisible: (isVisible: boolean) => void
}

const AmenitiesView = ({
  isAmenitiesVisible,
  setIsAmenitiesVisible
}: AmenitiesViewProps): ReactElement => {
  return (
    <div style={{ padding: '15px' }}>
      <h1
        style={{
          // same as '.otp .route-viewer .header-text'
          display: 'contents',
          fontSize: '24px',
          fontWeight: 700,
          margin: 0
        }}
      >
        <FormattedMessage id="components.AmenitiesViewer.shortTitle" />
      </h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          padding: '5px 10px'
        }}
      >
        <label
          htmlFor="toggle-amenities"
          style={{
            cursor: 'pointer',
            display: 'flex',
            gap: '8px'
          }}
        >
          <FormattedMessage id="components.AmenitiesViewer.showAmenities" />
          <input
            checked={isAmenitiesVisible}
            id="toggle-amenities"
            onChange={(e) => setIsAmenitiesVisible(e.target.checked)}
            type="checkbox"
          />
        </label>
      </div>
      {legendItems.map((item) => (
        <LegendItem key={item.amenityType} {...item} />
      ))}
      <CommunautoItem />
      <ParkAndRideItem />
    </div>
  )
}

const mapStateToProps = (state: AppReduxState) => {
  return {
    isAmenitiesVisible: state.fabmob.isAmenitiesVisible
  }
}

const mapDispatchToProps = {
  setIsAmenitiesVisible: setIsAmenitiesVisible
}

export default connect(mapStateToProps, mapDispatchToProps)(AmenitiesView)
