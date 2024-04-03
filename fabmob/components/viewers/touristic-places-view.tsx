import { connect } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import React, { ReactElement } from 'react'

import { AppReduxState } from '../../../lib/util/state-types'
import { TouristicPlaceIndicator } from '../../icons/touristic-places-indicator'
import { touristicPlacesColors } from '../../actions/ui-constants'

const legendItems = [
  {
    color: touristicPlacesColors.art,
    label: 'components.TouristicPlacesViewer.legendArt'
  },
  {
    color: touristicPlacesColors.natural,
    label: 'components.TouristicPlacesViewer.legendNatural'
  },
  {
    color: touristicPlacesColors.religious,
    label: 'components.TouristicPlacesViewer.legendReligious'
  },
  {
    color: touristicPlacesColors.default,
    label: 'components.TouristicPlacesViewer.legendDefault'
  }
]

const LegendItem = ({ color, label }: { color: string; label: string }) => {
  const intl = useIntl()
  return (
    <div style={{ alignItems: 'center', display: 'flex', padding: '10px' }}>
      <TouristicPlaceIndicator color={color} size="20px" />
      <div style={{ width: '20px' }} />
      <div>{intl.formatMessage({ id: label })}</div>
    </div>
  )
}

const TouristicPlacesView = (): ReactElement => {
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
        <FormattedMessage id="components.TouristicPlacesViewer.shortTitle" />
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

export default connect(mapStateToProps, mapDispatchToProps)(TouristicPlacesView)
