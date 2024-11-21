import { connect } from 'react-redux'
import { FormikProps } from 'formik'
import { useIntl, WrappedComponentProps } from 'react-intl'
import React, { useCallback, useEffect } from 'react'

import * as userActions from '../../../actions/user'
import { AppReduxState } from '../../../util/state-types'
import { DependentInfo, MonitoredTrip, User } from '../types'
import { getDependentName } from '../../../util/user'

import CompanionSelector, { Option } from './companion-selector'

type Props = WrappedComponentProps &
  FormikProps<MonitoredTrip> & {
    getDependentUserInfo: (args: string[]) => DependentInfo[]
    isReadOnly: boolean
    loggedInUser: User
  }

function optionValue(option: Option) {
  if (!option) return null
  return option?.value
}

/**
 * Pane for showing/setting trip companions and observers.
 */
const TripCompanions = ({
  getDependentUserInfo,
  isReadOnly,
  loggedInUser,
  setFieldValue,
  values: trip
}: Props): JSX.Element => {
  const handleCompanionChange = useCallback(
    (option: Option) => {
      setFieldValue('companion', optionValue(option))
    },
    [setFieldValue]
  )

  const handleObserversChange = useCallback(
    (options: Option[]) => {
      setFieldValue('observers', (options || []).map(optionValue))
    },
    [setFieldValue]
  )

  const intl = useIntl()

  useEffect(() => {
    if (loggedInUser?.dependents.length > 0) {
      getDependentUserInfo(loggedInUser?.dependents, intl)
    }
  }, [loggedInUser.dependents, getDependentUserInfo, intl])

  const { companion, observers, primary } = trip

  const iAmThePrimaryTraveler =
    (!primary && trip.userId === loggedInUser?.id) ||
    primary?.userId === loggedInUser?.id

  const primaryTraveler = iAmThePrimaryTraveler
    ? 'Myself'
    : primary
    ? primary.email
    : getDependentName(
        loggedInUser?.dependentsInfo?.find((d) => d.userId === trip.userId)
      )

  return (
    <div>
      <p>
        Primary traveler: <strong>{primaryTraveler}</strong>
      </p>
      <p>
        {/* TODO: a11y label */}
        Companion on this trip:
        <CompanionSelector
          disabled={isReadOnly || !iAmThePrimaryTraveler}
          excludedUsers={observers}
          onChange={handleCompanionChange}
          selectedCompanions={companion}
        />
      </p>
      <p>
        {/* TODO: a11y label */}
        Observers:
        <CompanionSelector
          disabled={isReadOnly}
          excludedUsers={[companion]}
          multi
          onChange={handleObserversChange}
          selectedCompanions={observers}
        />
      </p>
    </div>
  )
}

// connect to the redux store

const mapStateToProps = (state: AppReduxState) => ({
  loggedInUser: state.user.loggedInUser
})

const mapDispatchToProps = {
  getDependentUserInfo: userActions.getDependentUserInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(TripCompanions)
