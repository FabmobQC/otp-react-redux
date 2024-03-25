import {
  ClearLocationArg,
  MapLocationActionArg,
  UserLocationAndType
} from '@opentripplanner/types'
import { connect } from 'react-redux'
import { IntlShape, useIntl } from 'react-intl'
import Endpoint from '@opentripplanner/endpoints-overlay/lib/endpoint'
import EndpointsOverlay from '@opentripplanner/endpoints-overlay'
import React, { ComponentProps, ReactElement, useCallback } from 'react'

import {
  StackedIconContainer,
  StackedToIcon,
  ToIcon
} from '@opentripplanner/endpoints-overlay/lib/styled'

import { clearLocation } from '../../../lib/actions/form'
import { convertToPlace, getUserLocations } from '../../../lib/util/user'
import {
  forgetPlace,
  rememberPlace,
  UserActionResult
} from '../../../lib/actions/user'
import { getShowUserSettings } from '../../../lib/util/state'
import { setLocation } from '../../../lib/actions/map'
import { toastOnPlaceSaved } from '../../../lib/components/util/toasts'

const Icon = ({ location, type }: UserLocationAndType): ReactElement => {
  const PIXELS = 20
  const toPixels = PIXELS * 1.3
  return (
    <StackedIconContainer title={location.name}>
      <StackedToIcon size={toPixels} type="to" />
      <ToIcon size={toPixels - 6} type="to" />
    </StackedIconContainer>
  )
}

type Props = ComponentProps<typeof EndpointsOverlay> & {
  additionalPlaces: Location[]
  clearLocation: (arg: ClearLocationArg) => void
  forgetPlace: (place: string, intl: IntlShape) => void
  locations: Location[]
  rememberPlace: (arg: UserLocationAndType, intl: IntlShape) => number
  setLocation: (arg: MapLocationActionArg) => void
  showUserSettings: boolean
  visible?: boolean
}

const AdditionalPlacesOverlay = ({
  forgetPlace,
  rememberPlace,
  ...otherProps
}: Props): JSX.Element => {
  const intl = useIntl()
  const _forgetPlace = useCallback(
    (place) => {
      forgetPlace(place, intl)
    },
    [forgetPlace, intl]
  )

  const _rememberPlace = useCallback(
    async (placeTypeLocation) => {
      const result = await rememberPlace(placeTypeLocation, intl)
      if (result === UserActionResult.SUCCESS) {
        toastOnPlaceSaved(convertToPlace(placeTypeLocation.location), intl)
      }
    },
    [rememberPlace, intl]
  )
  return (
    <>
      {otherProps.additionalPlaces.map((place: any, index: number) => (
        <Endpoint
          clearLocation={otherProps.clearLocation}
          forgetPlace={_forgetPlace}
          key={index}
          location={place}
          locations={otherProps.locations}
          MapMarkerIcon={Icon}
          rememberPlace={_rememberPlace}
          setLocation={otherProps.setLocation}
          showUserSettings={otherProps.showUserSettings}
          type={place.type}
        />
      ))}
    </>
  )
}

const mapStateToProps = (state: any) => {
  const { viewedRoute } = state.otp.ui
  // If the route viewer is active, do not show itinerary on map.
  // mainPanelContent is null whenever the trip planner is active.
  // Some views like the stop viewer can be accessed via the trip planner
  // or the route viewer, so include a route being viewed as a condition
  // for hiding
  if (state.otp.ui.mainPanelContent !== null && viewedRoute) {
    return {}
  }

  const showUserSettings = getShowUserSettings(state)
  // Intermediate places doesn't trigger a re-plan, so for now default to
  // current query. FIXME: Determine with TriMet if this is desired behavior.
  const places = state.otp.currentQuery.additionalPlaces.filter((p: any) => p)

  return {
    additionalPlaces: places,
    locations: getUserLocations(state).saved,
    showUserSettings,
    visible: true
  }
}

const mapDispatchToProps = {
  clearLocation,
  forgetPlace,
  rememberPlace,
  setLocation
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdditionalPlacesOverlay)
