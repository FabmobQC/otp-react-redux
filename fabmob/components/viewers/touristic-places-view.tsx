import { connect } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import React, { ReactElement } from 'react'

import { AppReduxState } from '../../../lib/util/state-types'
import { TouristicPlaceIndicator } from '../../icons/touristic-places-indicator'
import { touristicPlacesColors } from '../../actions/ui-constants'

const legendItems = [
  {
    color: touristicPlacesColors.attraction,
    label: 'components.TouristicPlacesViewer.legendAttraction'
  },
  {
    color: touristicPlacesColors.culture,
    label: 'components.TouristicPlacesViewer.legendCulture'
  },
  {
    color: touristicPlacesColors.accommodation,
    label: 'components.TouristicPlacesViewer.legendAccommodation'
  },
  {
    color: touristicPlacesColors.historical,
    label: 'components.TouristicPlacesViewer.legendHistorical'
  },
  {
    color: touristicPlacesColors.museum,
    label: 'components.TouristicPlacesViewer.legendMuseum'
  },
  {
    color: touristicPlacesColors.nature,
    label: 'components.TouristicPlacesViewer.legendNature'
  },
  {
    color: touristicPlacesColors.organizedTour,
    label: 'components.TouristicPlacesViewer.legendOrganizedTour'
  },
  {
    color: touristicPlacesColors.relaxation,
    label: 'components.TouristicPlacesViewer.legendRelaxation'
  },
  {
    color: touristicPlacesColors.religious,
    label: 'components.TouristicPlacesViewer.legendReligious'
  },
  {
    color: touristicPlacesColors.restaurant,
    label: 'components.TouristicPlacesViewer.legendRestaurant'
  },
  {
    color: touristicPlacesColors.shopping,
    label: 'components.TouristicPlacesViewer.legendShopping'
  },
  {
    color: touristicPlacesColors.showFestival,
    label: 'components.TouristicPlacesViewer.legendShowFestival'
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
