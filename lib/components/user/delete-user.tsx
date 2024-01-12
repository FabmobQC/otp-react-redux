import { Auth0ContextInterface, useAuth0 } from '@auth0/auth0-react'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { FormattedMessage, IntlShape, useIntl } from 'react-intl'
import React, { FormEvent, useCallback } from 'react'
import styled from 'styled-components'

import * as userActions from '../../actions/user'
import { RED_ON_WHITE } from '../util/colors'

interface Props {
  deleteUser: (auth0: Auth0ContextInterface, intl: IntlShape) => void
}

const DeleteButton = styled(Button)`
  background-color: white;
  border-color: ${RED_ON_WHITE};
  color: ${RED_ON_WHITE};
  :active,
  :focus,
  :focus:active,
  :hover {
    border-color: ${RED_ON_WHITE};
    color: ${RED_ON_WHITE};
  }
`

/**
 * Renders a delete user button for the account settings page.
 */
const DeleteUser = ({ deleteUser }: Props): JSX.Element => {
  const auth0 = useAuth0()
  const intl = useIntl()

  const handleDelete = useCallback(
    (evt: FormEvent) => {
      // Avoid triggering onsubmit with formik (which would result in a save user call).
      evt.preventDefault()
      if (
        window.confirm(
          intl.formatMessage({
            id: 'components.UserAccountScreen.confirmDelete'
          })
        )
      ) {
        deleteUser(auth0, intl)
      }
    },
    [auth0, deleteUser, intl]
  )

  return (
    <DeleteButton bsSize="large" onClick={handleDelete}>
      <FormattedMessage id="components.DeleteUser.deleteMyAccount" />
    </DeleteButton>
  )
}

const mapDispatchToProps = {
  deleteUser: userActions.deleteUser
}

export default connect(null, mapDispatchToProps)(DeleteUser)
