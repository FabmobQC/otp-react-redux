import { connect } from 'react-redux'
import { FromToPickerProps } from '@opentripplanner/from-to-location-picker/lib/types'
import FromToLocationPickerOri from '@opentripplanner/from-to-location-picker'
import React, { ReactElement, useCallback } from 'react'

interface Props extends FromToPickerProps {
  currentQuery: any
}

export const FromToLocationPicker = ({
  currentQuery,
  setLocation,
  ...props
}: Props): ReactElement => {
  const { additionalPlaces, to } = currentQuery

  const customSetLocation = useCallback(
    (params) => {
      if (
        params.locationType === 'to' &&
        to !== null &&
        additionalPlaces.length > 0
      ) {
        const emptyAdditionalPlaceIndex = additionalPlaces.findIndex(
          (place: any) => place === undefined
        )
        const index =
          emptyAdditionalPlaceIndex !== -1
            ? emptyAdditionalPlaceIndex // we priorise the empty slot
            : additionalPlaces.length - 1 // There's no empty slot. We take the last index.
        params.locationType = `additional-${index}`
      }
      setLocation?.(params)
    },
    [additionalPlaces, setLocation, to]
  )

  return <FromToLocationPickerOri {...props} setLocation={customSetLocation} />
}

const mapStateToProps = (state: any) => {
  return {
    currentQuery: state.otp.currentQuery
  }
}

export default connect(mapStateToProps)(FromToLocationPicker)
