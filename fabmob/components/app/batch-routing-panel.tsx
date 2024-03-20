import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl'
import React, { Component, FormEvent } from 'react'

import * as mapActions from '../../../lib/actions/map'
import { getActiveSearch, getShowUserSettings } from '../../../lib/util/state'
import { getPersistenceMode } from '../../../lib/util/user'
import AddPlaceButton from '../../../lib/components/form/add-place-button'
import BatchSettings from '../../../lib/components/form/batch-settings'
import InvisibleA11yLabel from '../../../lib/components/util/invisible-a11y-label'
import LocationField from '../../../lib/components/form/connected-location-field'
import NarrativeItineraries from '../../../lib/components/narrative/narrative-itineraries'
import SwitchButton from '../../../lib/components/form/switch-button'
import UserSettings from '../../../lib/components/form/user-settings'
import ViewerContainer from '../../../lib/components/viewers/viewer-container'

interface Props {
  activeSearch: any
  currentQuery: any
  intl: IntlShape
  mobile?: boolean
  setLocation: (params: any) => void
  showUserSettings: boolean
}

/**
 * Main panel for the batch/trip comparison form.
 */
class BatchRoutingPanel extends Component<Props> {
  state = {
    planTripClicked: false
  }

  handleSubmit = (e: FormEvent) => e.preventDefault()

  handlePlanTripClick = () => {
    this.setState({ planTripClicked: true })
  }

  _addPlace = () => {
    const index = this.props.currentQuery.additionalPlaces.length
    this.props.setLocation({
      location: undefined,
      locationType: `additional-${index}`
    })
  }

  render() {
    const { activeSearch, currentQuery, intl, mobile, showUserSettings } =
      this.props
    const { additionalPlaces } = currentQuery
    const { planTripClicked } = this.state
    const mapAction = mobile
      ? intl.formatMessage({
          id: 'common.searchForms.tap'
        })
      : intl.formatMessage({
          id: 'common.searchForms.click'
        })

    return (
      <ViewerContainer
        className="batch-routing-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <InvisibleA11yLabel>
          <h1>
            <FormattedMessage id="components.BatchSearchScreen.header" />
          </h1>
        </InvisibleA11yLabel>
        <form
          className="form"
          onSubmit={this.handleSubmit}
          style={{ padding: '10px' }}
        >
          <span className="batch-routing-panel-location-fields">
            <LocationField
              inputPlaceholder={intl.formatMessage(
                { id: 'common.searchForms.enterStartLocation' },
                { mapAction }
              )}
              isRequired
              locationType="from"
              selfValidate={planTripClicked}
              showClearButton={!mobile}
            />
            <LocationField
              inputPlaceholder={intl.formatMessage(
                { id: 'common.searchForms.enterDestination' },
                { mapAction }
              )}
              isRequired
              locationType="to"
              selfValidate={planTripClicked}
              showClearButton={!mobile}
            />
            <div className="switch-button-container">
              <SwitchButton />
            </div>
            {additionalPlaces.map((place: unknown, i: number) => {
              return (
                <LocationField
                  inputPlaceholder={intl.formatMessage({
                    id: 'common.searchForms.enterAdditionalPlace'
                  })}
                  key={i}
                  location={place}
                  locationType={`additional-${i}`}
                  selfValidate={planTripClicked}
                  showClearButton={!mobile}
                />
              )
            })}
          </span>
          <AddPlaceButton
            from="dummy"
            intermediatePlaces={additionalPlaces}
            onClick={this._addPlace}
            to="dummy"
          />
          <BatchSettings onPlanTripClick={this.handlePlanTripClick} />
        </form>
        {!activeSearch && showUserSettings && (
          <UserSettings style={{ margin: '0 10px', overflowY: 'auto' }} />
        )}
        <div
          className="desktop-narrative-container"
          style={{
            flexGrow: 1,
            overflowY: 'hidden'
          }}
        >
          <NarrativeItineraries />
        </div>
      </ViewerContainer>
    )
  }
}

// connect to the redux store
const mapStateToProps = (state: any) => {
  // Show the place shortcuts for OTP-middleware users who have accepted the terms of use
  // and deployments using persistence to localStorage. Don't show shortcuts otherwise.
  const showUserSettings =
    getShowUserSettings(state) &&
    (state.user.loggedInUser?.hasConsentedToTerms ||
      getPersistenceMode(state.otp.config.persistence).isLocalStorage)
  return {
    activeSearch: getActiveSearch(state),
    currentQuery: state.otp.currentQuery,
    showUserSettings
  }
}

const mapDispatchToProps = {
  setLocation: mapActions.setLocation
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(BatchRoutingPanel))
