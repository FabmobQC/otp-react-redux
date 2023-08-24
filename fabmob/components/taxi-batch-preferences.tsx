import * as TripFormClasses from '@opentripplanner/trip-form/lib/styled'
import { injectIntl, IntlShape } from 'react-intl'
import {
  SettingsSelectorPanel,
  SubmodeSelector
} from '@opentripplanner/trip-form'
import React, { useCallback } from 'react'
import styled from 'styled-components'

import { getFormattedTaxiAssetType } from '../utils/i18n'
import { modeButtonButtonCss } from '../../lib/components/form/styled'

interface Props {
  className?: string
  intl: IntlShape
  onQueryParamChange: Parameters<
    typeof SettingsSelectorPanel
  >[0]['onQueryParamChange']
  queryParams: Parameters<typeof SettingsSelectorPanel>[0]['queryParams']
}

const taxiAssetTypes = [
  'taxi-registry-standard',
  'taxi-registry-minivan',
  'taxi-registry-special-need'
]

const TaxiBatchPreferences = ({
  className,
  intl,
  onQueryParamChange,
  queryParams
}: Props) => {
  const toggle = useCallback(
    (id: string) => {
      const currentTaxiAssetType = queryParams?.taxiAssetType?.split(',') ?? []
      let newTaxiAssetType: string[] = []
      if (currentTaxiAssetType.includes(id)) {
        newTaxiAssetType = currentTaxiAssetType.filter(
          (taxiType) => taxiType !== id
        )
        if (newTaxiAssetType.length === 0) {
          newTaxiAssetType = currentTaxiAssetType
        }
      } else {
        newTaxiAssetType = [...currentTaxiAssetType, id]
      }
      onQueryParamChange?.({
        taxiAssetType: newTaxiAssetType.join()
      })
    },
    [onQueryParamChange, queryParams]
  )

  return (
    <div className={className}>
      <SubmodeSelector
        className={className}
        label="Taxi"
        modes={taxiAssetTypes.map((taxiAssetType) => ({
          id: taxiAssetType,
          selected: queryParams?.taxiAssetType?.includes(taxiAssetType),
          text: getFormattedTaxiAssetType(taxiAssetType, intl)
        }))}
        onChange={toggle}
      />
    </div>
  )
}

// FIXME: This is identical to StyledSettingsSelectorPanel
export const StyledTaxiBatchPreferences = styled(TaxiBatchPreferences)`
  ${modeButtonButtonCss}

  ${TripFormClasses.SettingLabel} {
    color: #686868;
    font-size: 14px;
    /* Override bootstrap's font-weight on labels so they don't appear bold in batch settings. */
    font-weight: inherit;
    letter-spacing: 1px;
    padding-top: 8px;
    text-transform: uppercase;
  }

  ${TripFormClasses.SubmodeSelector.Row} {
    font-size: 12px;
    > * {
      padding: 3px 5px 3px 0px;
    }
    > :last-child {
      padding-right: 0px;
    }
    ${TripFormClasses.ModeButton.Button} {
      height: 35px;
    }
    svg,
    img {
      margin-left: 0px;
    }
  }
  ${TripFormClasses.SubmodeSelector} {
    ${TripFormClasses.SettingLabel} {
      margin-bottom: 0;
    }
  }
  ${TripFormClasses.SubmodeSelector.InlineRow} {
    margin: -3px 0px;
    svg,
    img {
      height: 18px;
      max-width: 32px;
    }
  }
`

export default injectIntl(StyledTaxiBatchPreferences)
