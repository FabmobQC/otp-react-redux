import { injectIntl, IntlShape } from 'react-intl'
import { Itinerary } from '@opentripplanner/types'
import React from 'react'

interface Props {
  intl: IntlShape
  itinerary: Itinerary
}

const BookingDetails = ({ intl, itinerary }: Props) => {
  const firstLeg = itinerary.legs[0]
  if (firstLeg.mode !== 'TAXI') {
    return <></>
  }

  const phoneNumber = firstLeg.pickupBookingInfo?.contactInfo?.phoneNumber
  return (
    <div className="trip-tools-container">
      <h2>{intl.formatMessage({ id: 'components.MetroUI.book.bookTaxi' })}</h2>
      <p>{firstLeg.agencyName}</p>
      <p>
        <a href={firstLeg.agencyUrl}>{firstLeg.agencyUrl}</a>
      </p>
      <p>
        <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
      </p>
    </div>
  )
}

export default injectIntl(BookingDetails)
