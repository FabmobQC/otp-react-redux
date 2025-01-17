import { FormattedMessage, useIntl } from 'react-intl'
import React from 'react'

import Link from '../util/link'

/**
 * This component is a switcher between
 * the main views of the application.
 */
const ViewSwitcher = (): JSX.Element => {
  const intl = useIntl()
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
      <Link to="/nearby" tracking>
        <FormattedMessage id="components.ViewSwitcher.nearby" />
      </Link>
      <Link to="/touristic-places" tracking>
        <FormattedMessage id="components.TouristicPlacesViewer.shortTitle" />
      </Link>
    </div>
  )
}

export default ViewSwitcher
