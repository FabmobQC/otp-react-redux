import { connect } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import React, { ReactElement } from 'react'

import { AmenityIndicator } from '../../icons/amenity-indicator'
import { AmenityType } from '../../reducers/create-fabmob-reducer'
import { AppReduxState } from '../../../lib/util/state-types'

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

const AmenitiesView = (): ReactElement => {
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
      {legendItems.map((item) => (
        <LegendItem key={item.amenityType} {...item} />
      ))}
    </div>
  )
}

const mapStateToProps = (state: AppReduxState) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AmenitiesView)
