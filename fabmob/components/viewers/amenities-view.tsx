import { connect } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import React, { ReactElement } from 'react'

import { amenitiesColors } from '../../actions/ui-constants'
import { AmenityIndicator } from '../../icons/amenity-indicator'
import { AppReduxState } from '../../../lib/util/state-types'

const legendItems = [
  {
    color: amenitiesColors.education,
    label: 'components.AmenitiesViewer.legendEducation'
  },
  {
    color: amenitiesColors.groceryStore,
    label: 'components.AmenitiesViewer.legendGroceryStore'
  },
  {
    color: amenitiesColors.healthCenter,
    label: 'components.AmenitiesViewer.legendHealthCenter'
  }
]

const LegendItem = ({ color, label }: { color: string; label: string }) => {
  const intl = useIntl()
  return (
    <div style={{ alignItems: 'center', display: 'flex', padding: '10px' }}>
      <AmenityIndicator color={color} size="20px" />
      <div style={{ width: '20px' }} />
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
        <LegendItem key={item.label} {...item} />
      ))}
    </div>
  )
}

const mapStateToProps = (state: AppReduxState) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AmenitiesView)
