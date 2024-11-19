import { FormikProps } from 'formik'
import React, { useCallback } from 'react'
import type { WrappedComponentProps } from 'react-intl'

import { MonitoredTrip } from '../types'

import CompanionSelector, { Option } from './companion-selector'

type Props = WrappedComponentProps & FormikProps<MonitoredTrip>

/**
 * Pane for showing/setting trip companions and observers.
 */
const TripCompanions = (props: Props): JSX.Element => {
  console.log(props)

  const handleCompanionChange = useCallback(
    (option: Option) => {
      props.setFieldValue('companion', option ? option.value : null)
    },
    [props]
  )

  const handleObserversChange = useCallback(
    (options: Option[]) => {
      props.setFieldValue(
        'observers',
        (options || []).map((option) => option.value)
      )
    },
    [props]
  )

  return (
    <div>
      <p>
        Primary traveler:{' '}
        <strong>
          {props.values.primary ? props.values.primary.email : 'Myself'}
        </strong>
      </p>
      <p>
        Companion on this trip:
        <CompanionSelector
          excludedUsers={props.values.observers}
          onChange={handleCompanionChange}
          selectedCompanions={props.values.companion}
        />
      </p>
      <p>
        Observers:
        <CompanionSelector
          excludedUsers={[props.values.companion]}
          multi
          onChange={handleObserversChange}
          selectedCompanions={props.values.observers}
        />
      </p>
    </div>
  )
}

export default TripCompanions
