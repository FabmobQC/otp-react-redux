import { DropdownSelector } from '@opentripplanner/trip-form'
import { useIntl } from 'react-intl'
import React, { ReactElement } from 'react'

interface Props {
  additionalPlacesWaitingTimes: number[]
  index: number
  onChange: (params: any) => void
}

export const WaitingTimeSelector = ({
  additionalPlacesWaitingTimes,
  index,
  onChange
}: Props): ReactElement => {
  const intl = useIntl()

  return (
    <DropdownSelector
      label={intl.formatMessage({
        id: 'common.searchForms.additionalPlacesWaitingTimes-label'
      })}
      name={`additionalPlacesWaitingTimes-${index}`}
      onChange={onChange}
      options={getOptions([0, 0.25, 0.5, 0.75, 1, 2, 3, 4, 5], intl)}
      value={additionalPlacesWaitingTimes[index]}
    />
  )
}

const getOptions = (values: number[], intl: any): any => {
  return values.map((value: any) => {
    const units = value < 1 ? 'minutes' : 'hours'
    const time = value < 1 ? value * 60 : value
    return {
      text: intl.formatMessage(
        {
          id: `common.searchForms.additionalPlacesWaitingTimes-options-${units}`
        },
        { time }
      ),
      value
    }
  })
}

export default WaitingTimeSelector
