import { connect } from 'react-redux'
import React, { lazy, Suspense, useCallback } from 'react'

import { AppReduxState } from '../../../util/state-types'
import { CompanionInfo, User } from '../types'

export interface Option {
  label: string
  value: CompanionInfo
}

// @ts-expect-error: No types for react-select.
const Select = lazy(() => import('react-select'))

function notNull(item: unknown) {
  return !!item
}

function makeOption(companion?: CompanionInfo) {
  return {
    label: companion?.nickname || companion?.email,
    value: companion
  }
}

const CompanionSelector = ({
  disabled,
  excludedUsers = [],
  loggedInUser,
  multi = false,
  onChange,
  selectedCompanions
}: {
  disabled?: boolean
  excludedUsers?: (CompanionInfo | undefined)[]
  loggedInUser?: User
  multi?: boolean
  onChange: (e: Option | Option[]) => void
  selectedCompanions?: (CompanionInfo | undefined)[]
}): JSX.Element => {
  const companionOptions = (loggedInUser?.relatedUsers || [])
    .filter(notNull)
    .filter(({ status = '' }) => status === 'CONFIRMED')
    .map(makeOption)
  const companionValues = multi
    ? selectedCompanions?.filter(notNull).map(makeOption)
    : selectedCompanions?.[0]
    ? makeOption(selectedCompanions[0])
    : null

  const isOptionDisabled = useCallback(
    (option: Option) => excludedUsers.includes(option?.value),
    [excludedUsers]
  )

  return (
    <Suspense fallback={<span>...</span>}>
      <Select
        isClearable
        isDisabled={disabled}
        isMulti={multi}
        isOptionDisabled={isOptionDisabled}
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
