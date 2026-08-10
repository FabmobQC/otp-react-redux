import { FormattedMessage, useIntl } from 'react-intl'
import React, { useContext } from 'react'

import { AppConfig } from '../../util/config-types'
import { ComponentContext } from '../../util/contexts'
import { ExtraView } from '../../util/config-types'
import Link from '../util/link'

// TODO: Move to generic types file

/**
 * This component is a switcher between
 * the main views of the application.
 */
const ViewSwitcher = ({ config }: { config: AppConfig }): JSX.Element => {
  const intl = useIntl()
  // @ts-expect-error Context not typed
  const { extraViews } = useContext(ComponentContext)
  return (
    <div
      aria-label={intl.formatMessage({
        id: 'components.ViewSwitcher.switcher'
      })}
      className="view-switcher"
      id="view-switcher"
      role="group"
    >
      <Link to="/" tracking>
        <FormattedMessage id="components.BatchRoutingPanel.shortTitle" />
      </Link>
      <Link to="/route" tracking>
        <FormattedMessage id="components.RouteViewer.shortTitle" />
      </Link>
      {config.fabmob.displayNearby && (
      <Link to="/nearby" tracking>
        <FormattedMessage id="components.ViewSwitcher.nearby" />
      </Link>
      )}
      {config.fabmob.displayTouristicPlaces && (
        <Link to="/touristic-places" tracking>
          <FormattedMessage id="components.TouristicPlacesViewer.shortTitle" />
        </Link>
      )}
      {config.fabmob.displayAmenities && (
        <Link to="/amenities" tracking>
          <FormattedMessage id="components.AmenitiesViewer.shortTitle" />
        </Link>
      )}
      {extraViews
        .filter((v: ExtraView) => !!v?.name && v?.showInHeaderBar)
        .map((view: ExtraView) => (
          <Link key={view.path} to={view.path} tracking>
            {view.name}
          </Link>
        ))}
    </div>
  )
}

export default ViewSwitcher
