import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl'
import React, { Component, FormEvent } from 'react'

import * as apiActions from '../../../lib/actions/api'
import * as fabmobActions from '../../actions/fabmob'
import * as mapActions from '../../../lib/actions/map'
import {
  advancedPanelClassName,
  mainPanelClassName,
  transitionDuration,
  TransitionStyles
} from '../../../lib/components/form/styled'
import { alertUserTripPlan } from '../../../lib/components/form/util'
import { getActiveSearch, getShowUserSettings } from '../../../lib/util/state'
import { getPersistenceMode } from '../../../lib/util/user'
import AddPlaceButton from '../../../lib/components/form/add-place-button'
import AdvancedSettingsPanel from '../../../lib/components/form/advanced-settings-panel'
import BatchSettings from '../../../lib/components/form/batch-settings'
import InvisibleA11yLabel from '../../../lib/components/util/invisible-a11y-label'
import LocationField from '../../../lib/components/form/connected-location-field'
import NarrativeItineraries from '../../../lib/components/narrative/narrative-itineraries'
import SwitchButton from '../../../lib/components/form/switch-button'
import UserSettings from '../../../lib/components/form/user-settings'
import ViewerContainer from '../../../lib/components/viewers/viewer-container'
import WaitingTimeSelector from '../../components/form/waiting-time-selector'

interface Props {
  activeSearch: any
  currentQuery: any
  geocoderResultsOrder?: Array<string>
  intl: IntlShape
  mainPanelContent: number
  mobile?: boolean
  routingQuery: () => void
  setAdditionalPlaceWaitingTime: (index: number, waitingTime: number) => void
  setLocation: (params: any) => void
  showUserSettings: boolean
}

/**
 * Main panel for the batch/trip comparison form.
 */
class BatchRoutingPanel extends Component<Props> {
  state = {
    closeAdvancedSettingsWithDelay: false,
    planTripClicked: false,
    showAdvancedModeSettings: false
  }

  _advancedSettingRef = React.createRef<HTMLDivElement>()
  _mainPanelContentRef = React.createRef<HTMLDivElement>()
  _itinerariesAndUserRef = React.createRef<HTMLDivElement>()

  componentDidUpdate(prevProps: Readonly<Props>): void {
    // Close the advanced mode settings if we navigate to another page
    if (
      prevProps.mainPanelContent === null &&
      this.props.mainPanelContent !== null &&
      this.state.showAdvancedModeSettings
    ) {
      this.setState({
        showAdvancedModeSettings: false
      })
    }
  }

  openAdvancedSettings = () => {
    this.setState({
      closeAdvancedSettingsWithDelay: false,
      showAdvancedModeSettings: true
    })
  }

  closeAdvancedSettings = () => {
    this.setState({ showAdvancedModeSettings: false })
  }

  setCloseAdvancedSettingsWithDelay = () => {
    this.setState({
      closeAdvancedSettingsWithDelay: true
    })
  }

  handleSubmit = (e: FormEvent) => e.preventDefault()

  handlePlanTripClick = () => {
    const { currentQuery, intl, routingQuery } = this.props
    alertUserTripPlan(
      intl,
      currentQuery,
      () => this.setState({ planTripClicked: true }),
      routingQuery
    )
  }

  _addPlace = () => {
    const index = this.props.currentQuery.additionalPlaces.length
    this.props.setLocation({
      location: undefined,
      locationType: `additional-place-${index}`
    })
    this.props.setAdditionalPlaceWaitingTime(index, 1)
  }

  _updateAdditionalTime = (params: any) => {
    // The key is the "name" property of DropdownSelector
    const [key, value] = Object.entries(params)[0]
    const index = parseInt(key.split('-')[1])
    this.props.setAdditionalPlaceWaitingTime(index, value as number)
  }

  render() {
    const {
      activeSearch,
      currentQuery,
      geocoderResultsOrder,
      intl,
      mobile,
      showUserSettings
    } = this.props
    const { additionalPlaces, additionalPlacesWaitingTimes } = currentQuery
    const { planTripClicked } = this.state
    const mapAction = mobile
      ? intl.formatMessage({
          id: 'common.searchForms.tap'
        })
      : intl.formatMessage({
          id: 'common.searchForms.click'
        })

    /* If there is a save button in advanced preferences, add a transition delay to allow
    the saved state to be displayed to users */
    const transitionDelay = this.state.closeAdvancedSettingsWithDelay ? 300 : 0
    const transitionDurationWithDelay = transitionDuration + transitionDelay

    return (
      <ViewerContainer
        className="batch-routing-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <TransitionStyles transitionDelay={transitionDelay}>
          {!this.state.showAdvancedModeSettings && (
            <InvisibleA11yLabel>
              <h1>
                <FormattedMessage id="components.BatchSearchScreen.header" />
              </h1>
            </InvisibleA11yLabel>
          )}
          <form
            className="form"
            onSubmit={this.handleSubmit}
            style={{ padding: '10px' }}
          >
            <TransitionGroup style={{ display: 'content' }}>
              {this.state.showAdvancedModeSettings && (
                <CSSTransition
                  classNames={advancedPanelClassName}
                  nodeRef={this._advancedSettingRef}
                  timeout={{
                    enter: transitionDuration,
                    exit: transitionDurationWithDelay
                  }}
                >
                  <AdvancedSettingsPanel
                    closeAdvancedSettings={this.closeAdvancedSettings}
                    handlePlanTrip={this.handlePlanTripClick}
                    innerRef={this._advancedSettingRef}
                    setCloseAdvancedSettingsWithDelay={
                      this.setCloseAdvancedSettingsWithDelay
                    }
                  />
                </CSSTransition>
              )}

              {!this.state.showAdvancedModeSettings && (
                <CSSTransition
                  classNames={mainPanelClassName}
                  nodeRef={this._mainPanelContentRef}
                  onExit={this.openAdvancedSettings}
                  timeout={transitionDurationWithDelay}
                >
                  <div ref={this._mainPanelContentRef}>
                    <span className="batch-routing-panel-location-fields">
                      <LocationField
                        geocoderResultsOrder={geocoderResultsOrder}
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
                        geocoderResultsOrder={geocoderResultsOrder}
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
                    </span>
                    {additionalPlaces.map((place: unknown, i: number) => {
                      return (
                        <div key={i}>
                          <div
                            style={{
                              alignItems: 'center',
                              display: 'flex',
                              justifyContent: 'flex-end'
                            }}
                          >
                            <WaitingTimeSelector
                              additionalPlacesWaitingTimes={
                                additionalPlacesWaitingTimes
                              }
                              index={i}
                              onChange={this._updateAdditionalTime}
                            />
                            <div
                              style={{
                                paddingLeft: '15px',
                                paddingRight: '32px'
                              }}
                            >
                              <SwitchButton index={i} />
                            </div>
                          </div>
                          <LocationField
                            inputPlaceholder={intl.formatMessage({
                              id: 'common.searchForms.enterAdditionalPlace'
                            })}
                            location={place ?? {}} // dummy object to force the clear button to appear
                            locationType={`additional-place-${i}`}
                            selfValidate={planTripClicked}
                            showClearButton={!mobile}
                          />
                        </div>
                      )
                    })}
                    <AddPlaceButton
                      from="dummy"
                      intermediatePlaces={additionalPlaces}
                      onClick={this._addPlace}
                      to="dummy"
                    />
                    <BatchSettings
                      onPlanTripClick={this.handlePlanTripClick}
                      openAdvancedSettings={this.openAdvancedSettings}
                    />
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>
          </form>
          <TransitionGroup style={{ display: 'contents' }}>
            {!this.state.showAdvancedModeSettings && (
              <CSSTransition
                classNames={mainPanelClassName}
                nodeRef={this._itinerariesAndUserRef}
                timeout={transitionDurationWithDelay}
              >
                <div
                  ref={this._itinerariesAndUserRef}
                  style={{ height: '100%', overflowY: 'auto' }}
                >
                  {!activeSearch && showUserSettings && (
                    <UserSettings
                      style={{ margin: '0 10px', overflowY: 'auto' }}
                    />
                  )}
                  <div
                    className="desktop-narrative-container"
                    style={{
                      flexGrow: 1,
                      height: activeSearch ? '100%' : 'auto',
                      overflowY: 'hidden'
                    }}
                  >
                    <NarrativeItineraries />
                  </div>
                </div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </TransitionStyles>
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
  const { mainPanelContent } = state.otp.ui
  const currentQuery = state.otp.currentQuery

  const geocoderResultsOrder = state.otp.config?.geocoder?.geocoderResultsOrder
  return {
    activeSearch: getActiveSearch(state),
    currentQuery,
    geocoderResultsOrder,
    mainPanelContent,
    showUserSettings
  }
}

const mapDispatchToProps = {
  routingQuery: apiActions.routingQuery,
  setAdditionalPlaceWaitingTime: fabmobActions.setAdditionalPlaceWaitingTime,
  setLocation: mapActions.setLocation
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(BatchRoutingPanel))
