import { connect } from 'react-redux'
import { QueryParamChangeEvent } from '@opentripplanner/trip-form/lib/types'
import React, { lazy, Suspense } from 'react'

import { AppReduxState } from '../../util/state-types'
import { CompanionInfo, User } from '../types'

export interface Option {
  label: string
  value: CompanionInfo
}

const Select = lazy(() => import('react-select'))

function notNull(item) {
  return !!item
}

function makeOption(companion: CompanionInfo) {
  return {
    label: companion?.nickname || companion?.email,
    value: companion
  }
}

const CompanionSelector = ({
  excludedUsers = [],
  loggedInUser,
  multi = false,
  onChange,
  selectedCompanions
}: {
  excludedUsers?: CompanionInfo[]
  loggedInUser?: User
  multi?: boolean
  onChange: (e: QueryParamChangeEvent) => void
  selectedCompanions?: CompanionInfo | CompanionInfo[]
}): JSX.Element => {
  const excludedEmails = excludedUsers.filter(notNull).map(({ email }) => email)
  const companionOptions = (loggedInUser?.relatedUsers || [])
    .filter(notNull)
    .filter(({ status = '' }) => status === 'CONFIRMED')
    .filter(({ email }) => !excludedEmails.includes(email))
    .map(makeOption)
  const companionValues = multi
    ? selectedCompanions?.filter(notNull).map(makeOption)
    : selectedCompanions !== null
    ? makeOption(selectedCompanions)
    : null

  return (
    <Suspense fallback={<span>...</span>}>
      <Select
        isClearable
        isMulti={multi}
        onChange={onChange}
        options={companionOptions}
        value={companionValues}
      />
    </Suspense>
  )
}

const mapStateToProps = (state: AppReduxState) => {
  return {
    loggedInUser: state.user.loggedInUser
  }
}

export default connect(mapStateToProps)(CompanionSelector)
