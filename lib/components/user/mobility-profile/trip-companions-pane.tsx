import { FormikProps } from 'formik'
import React, { useCallback } from 'react'
import type { WrappedComponentProps } from 'react-intl'

import { MonitoredTrip } from '../types'

import CompanionSelector, { Option } from './companion-selector'

type Props = WrappedComponentProps & FormikProps<MonitoredTrip>

function optionValue(option: Option) {
  if (!option) return null
  return option?.value
}

/**
 * Pane for showing/setting trip companions and observers.
 */
const TripCompanions = ({
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

  const didIPlanThisTrip = !primary

  return (
    <div>
      <p>
        Primary traveler:{' '}
        <strong>{didIPlanThisTrip ? 'Myself' : primary.email}</strong>
      </p>
      <p>
        Companion on this trip:
        <CompanionSelector
          disabled={!didIPlanThisTrip}
          excludedUsers={observers}
          onChange={handleCompanionChange}
          selectedCompanions={companion}
        />
      </p>
      <p>
        Observers:
        <CompanionSelector
          disabled={!didIPlanThisTrip}
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
