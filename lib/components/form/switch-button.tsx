import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { ExchangeAlt } from '@styled-icons/fa-solid/ExchangeAlt'
import { useIntl } from 'react-intl'
import React from 'react'

import * as formActions from '../../actions/form'
import { StyledIconWrapper } from '../util/styledIcon'

interface Props {
  index?: number
  switchLocations: (index?: number) => void
}

function SwitchButton({ index, switchLocations }: Props) {
  const intl = useIntl()
  return (
    <Button
      className="switch-button"
      onClick={() => switchLocations(index)}
      title={intl.formatMessage({
        id: 'components.SwitchButton.switchLocations'
      })}
    >
      <StyledIconWrapper rotate90>
        <ExchangeAlt />
      </StyledIconWrapper>
      <span className="hidden">
        {intl.formatMessage({ id: 'components.SwitchButton.defaultContent' })}
      </span>
    </Button>
  )
}

const mapDispatchToProps = {
  switchLocations: formActions.switchLocations
}

export default connect(null, mapDispatchToProps)(SwitchButton)
