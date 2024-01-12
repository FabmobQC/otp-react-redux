import { injectIntl, IntlShape } from 'react-intl'
import { Itinerary } from '@opentripplanner/types'
import React from 'react'

import { getFormattedTaxiAssetType } from '../utils/i18n'

interface Props {
  intl: IntlShape
  itinerary: Itinerary
}

const BookingDetails = ({ intl, itinerary }: Props) => {
  const taxiPricing = (itinerary as any).taxiPricing
  if (taxiPricing === undefined) {
    return <></>
  }
  const phoneNumber = taxiPricing.booking.phoneNumber ?? ''
  return (
    <div className="trip-tools-container">
      <h2>{intl.formatMessage({ id: 'components.MetroUI.book.bookTaxi' })}</h2>
      <p>
        {getFormattedTaxiAssetType(taxiPricing.mainAssetType.id ?? '', intl)}
      </p>
      <p>{taxiPricing.booking.agency.name}</p>
      <p>
        <a href={taxiPricing.booking.webUrl}>{taxiPricing.booking.webUrl}</a>
      </p>
      <p>
        <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
      </p>
    </div>
  )
}

export default injectIntl(BookingDetails)
