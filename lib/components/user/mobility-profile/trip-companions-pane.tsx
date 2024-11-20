import { FormikProps } from 'formik'
import React, { useCallback } from 'react'
import type { WrappedComponentProps } from 'react-intl'

import { MonitoredTrip } from '../types'

import CompanionSelector, { Option } from './companion-selector'

type Props = WrappedComponentProps &
  FormikProps<MonitoredTrip> & {
    isReadOnly: boolean
  }

function optionValue(option: Option) {
  if (!option) return null
  return option?.value
}

/**
 * Pane for showing/setting trip companions and observers.
 */
const TripCompanions = ({
  isReadOnly,
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

  const { companion, observers, primary } = trip

  const iAmThePrimaryTraveler = !primary

  return (
    <div>
      <p>
        Primary traveler:{' '}
        <strong>{iAmThePrimaryTraveler ? 'Myself' : primary.email}</strong>
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

export default TripCompanions
