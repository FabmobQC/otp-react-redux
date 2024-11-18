import { Ban } from '@styled-icons/fa-solid/Ban'
import { connect } from 'react-redux'
import {
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
  ProgressBar,
  Radio
} from 'react-bootstrap'
import { Field, FormikProps } from 'formik'
import { FormattedMessage, useIntl } from 'react-intl'
import { Prompt } from 'react-router'
// @ts-expect-error FormikErrorFocus does not support TypeScript yet.
import FormikErrorFocus from 'formik-error-focus'
import React, { Component, FormEventHandler } from 'react'
import styled from 'styled-components'
import type { IntlShape, WrappedComponentProps } from 'react-intl'

import * as userActions from '../../../actions/user'
import { AppReduxState } from '../../../util/state-types'
import { FieldSet } from '../styled'
import { getBaseColor, RED_ON_WHITE } from '../../util/colors'
import { getErrorStates } from '../../../util/ui'
import { ItineraryExistence, MonitoredTrip } from '../types'
import InvisibleA11yLabel from '../../util/invisible-a11y-label'

type Props = WrappedComponentProps &
  FormikProps<MonitoredTrip> & {
    canceled: boolean
  }

/**
 * Pane for showing/setting trip companions and observers.
 */
const TripCompanions = (props: Props): JSX.Element => {
  console.log(props)
  return (
    <div>
      <p>
        Primary traveler: {props.primary ? props.primary.email : 'None set'}
      </p>
      <p>Companions: {props.companions ? props.companions.length : 'None'}</p>
      <p>Observers: {props.observers ? props.observers.length : 'None'}</p>
    </div>
  )
}

// Connect to redux store

const mapStateToProps = (state: AppReduxState) => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TripCompanions)
