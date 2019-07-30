import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import moment from 'moment'
import 'moment-timezone'
import { VelocityTransitionGroup } from 'velocity-react'

import Icon from '../narrative/icon'
import LocationIcon from '../icons/location-icon'

import { setMainPanelContent, toggleAutoRefresh } from '../../actions/ui'
import { findStop, findStopTimesForStop } from '../../actions/api'
import { forgetStop, rememberStop, setLocation } from '../../actions/map'
import { routeComparator } from '../../util/itinerary'
import { formatDuration, formatStopTime, getTimeFormat } from '../../util/time'

class StopViewer extends Component {
  state = {}

  static propTypes = {
    hideBackButton: PropTypes.bool,
    stopData: PropTypes.object,
    viewedStop: PropTypes.object
  }

  _backClicked = () => this.props.setMainPanelContent(null)

  _setLocationFromStop = (type) => {
    const { setLocation, stopData } = this.props
    const location = {
      name: stopData.name,
      lat: stopData.lat,
      lon: stopData.lon
    }
    setLocation({ type, location, reverseGeocode: true })
    this.setState({ popupPosition: null })
  }

  _onClickPlanTo = () => this._setLocationFromStop('to')

  _onClickPlanFrom = () => this._setLocationFromStop('from')

  _refreshStopTimes = () => {
    const { findStopTimesForStop, viewedStop } = this.props
    findStopTimesForStop({ stopId: viewedStop.stopId })
    // TODO: GraphQL approach would just call findStop again.
    // findStop({ stopId: viewedStop.stopId })
    this.setState({ spin: true })
    window.setTimeout(this._stopSpin, 1000)
  }

  _onToggleAutoRefresh = () => {
    const { autoRefreshStopTimes, toggleAutoRefresh } = this.props
    if (autoRefreshStopTimes) {
      toggleAutoRefresh(false)
    } else {
      // Turn on auto-refresh and refresh immediately to give user feedback.
      this._refreshStopTimes()
      toggleAutoRefresh(true)
    }
  }

  _stopSpin = () => this.setState({ spin: false })

  componentWillMount () {
    // Load the viewed stop in the store when the Stop Viewer first mounts
    this.props.findStop({ stopId: this.props.viewedStop.stopId })
    // Turn on stop times refresh if enabled.
    if (this.props.autoRefreshStopTimes) this._startAutoRefresh()
  }

  componentWillUnmount () {
    // Turn off auto refresh unconditionally (just in case).
    this._stopAutoRefresh()
  }

  _startAutoRefresh = () => {
    const timer = window.setInterval(this._refreshStopTimes, 10000)
    this.setState({ timer })
  }

  _stopAutoRefresh = () => {
    window.clearInterval(this.state.timer)
  }

  _toggleFavorite = () => {
    const { forgetStop, rememberStop, stopData } = this.props
    if (this._isFavorite()) forgetStop(stopData.id)
    else rememberStop(stopData)
  }

  _isFavorite = () => this.props.stopData &&
    this.props.favoriteStops.findIndex(s => s.id === this.props.stopData.id) !== -1

  // refresh the stop in the store if the viewed stop changes w/ the
  // Stop Viewer already mounted
  componentWillReceiveProps (nextProps) {
    if (
      this.props.viewedStop &&
      nextProps.viewedStop &&
      this.props.viewedStop.stopId !== nextProps.viewedStop.stopId
    ) {
      this.props.findStop({ stopId: nextProps.viewedStop.stopId })
    }
    // Handle stopping or starting the auto refresh timer.
    if (this.props.autoRefreshStopTimes && !nextProps.autoRefreshStopTimes) this._stopAutoRefresh()
    else if (!this.props.autoRefreshStopTimes && nextProps.autoRefreshStopTimes) this._startAutoRefresh()
  }

  render () {
    const {
      stopData,
      hideBackButton,
      homeTimezone,
      stopViewerArriving,
      timeFormat
    } = this.props
    const { spin } = this.state
    // Rewrite stop ID to not include Agency prefix, if present
    // TODO: make this functionality configurable?
    let stopId
    if (stopData && stopData.id) {
      stopId = stopData.id.includes(':') ? stopData.id.split(':')[1] : stopData.id
    }
    // construct a lookup table mapping pattern (e.g. 'ROUTE_ID-HEADSIGN') to an array of stoptimes
    const stopTimesByPattern = {}
    if (stopData && stopData.routes && stopData.stopTimes) {
      stopData.stopTimes.forEach(patternTimes => {
        const routeId = getRouteIdForPattern(patternTimes.pattern)
        const headsign = patternTimes.times[0] && patternTimes.times[0].headsign
        patternTimes.pattern.headsign = headsign
        const id = `${routeId}-${headsign}`
        if (!(id in stopTimesByPattern)) {
          const route = stopData.routes.find(r => r.id === routeId)
          stopTimesByPattern[id] = {
            id,
            route,
            pattern: patternTimes.pattern,
            times: []
          }
        }
        const filteredTimes = patternTimes.times.filter(stopTime => {
          return stopTime.stopIndex < stopTime.stopCount - 1 // ensure that this isn't the last stop
        })
        stopTimesByPattern[id].times = stopTimesByPattern[id].times.concat(filteredTimes)
      })
    }
    return (
      <div className='stop-viewer'>
        {/* Header Block */}
        <div className='stop-viewer-header'>
          {/* Back button */}
          {!hideBackButton && (
            <div className='back-button-container'>
              <Button
                bsSize='small'
                onClick={this._backClicked}
              ><Icon type='arrow-left' />Back</Button>
            </div>
          )}

          {/* Header Text */}
          <div className='header-text'>
            {stopData
              ? <span>{stopData.name}</span>
              : <span>Loading Stop...</span>
            }
            <Button
              onClick={this._toggleFavorite}
              bsSize='large'
              style={{
                color: this._isFavorite() ? 'yellow' : 'black',
                padding: 0,
                marginLeft: '5px'
              }}
              bsStyle='link'>
              <Icon type={this._isFavorite() ? 'star' : 'star-o'} />
            </Button>
          </div>
          <div style={{ clear: 'both' }} />
        </div>

        {stopData && (
          <div className='stop-viewer-body'>
            {/*
              Plan trip from/to here buttons.
              TODO: Can this be combined w/ SetFromToButtons?
            */ }
            <div>
              <div>
                <b>Stop ID</b>: {stopId}
                <button
                  className='link-button pull-right'
                  style={{ fontSize: 'small' }}
                  onClick={this._refreshStopTimes}>
                  <Icon
                    className={spin ? 'fa-spin' : ''}
                    type='refresh' />{' '}
                  {moment(stopData.stopTimesLastUpdated).format(timeFormat)}
                </button>
              </div>
              <b>Plan a trip:</b>{' '}
              <LocationIcon type='from' />{' '}
              <button className='link-button'
                onClick={this._onClickPlanFrom}>
                From here
              </button>{' '}|{' '}
              <LocationIcon type='to' />{' '}
              <button className='link-button'
                onClick={this._onClickPlanTo}>
                To here
              </button>
            </div>

            {/* pattern listing */}
            {stopData.stopTimes && stopData.routes && (
              <div style={{ marginTop: 20 }}>
                {Object.values(stopTimesByPattern)
                  .sort((a, b) => routeComparator(a.route, b.route))
                  .map(patternTimes => {
                    // Only add pattern row if route is found.
                    // FIXME: there is currently a bug with the alernative transit index
                    // where routes are not associated with the stop if the only stoptimes
                    // for the stop are drop off only. See https://github.com/ibi-group/trimet-mod-otp/issues/217
                    if (!patternTimes.route) {
                      console.warn(`Cannot render stop times for missing route ID: ${getRouteIdForPattern(patternTimes.pattern)}`)
                      return null
                    }
                    return (
                      <PatternRow
                        pattern={patternTimes.pattern}
                        route={patternTimes.route}
                        stopTimes={patternTimes.times}
                        key={patternTimes.id}
                        stopViewerArriving={stopViewerArriving}
                        homeTimezone={homeTimezone}
                        timeFormat={timeFormat}
                      />
                    )
                  })
                }
              </div>
            )}
            <div style={{ marginTop: '20px' }}>
              <label style={{ fontWeight: 300, fontSize: 'small' }}>
                <input
                  name='autoUpdate'
                  type='checkbox'
                  checked={this.props.autoRefreshStopTimes}
                  onChange={this._onToggleAutoRefresh} />{' '}
                Auto-refresh arrivals?
              </label>
            </div>
            {/* Future: add stop details */}
          </div>
        )}
      </div>
    )
  }
}

class PatternRow extends Component {
  constructor () {
    super()
    this.state = { expanded: false }
  }

  _toggleExpandedView = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render () {
    const {
      pattern,
      route,
      stopTimes,
      homeTimezone,
      stopViewerArriving,
      timeFormat
    } = this.props
    // sort stop times by next departure
    let sortedStopTimes = null
    if (stopTimes) {
      sortedStopTimes = stopTimes.sort((a, b) => {
        const aTime = a.serviceDay + a.realtimeDeparture
        const bTime = b.serviceDay + b.realtimeDeparture
        return aTime - bTime
      })
      // Cap the number of times shown for any Route at 5. TODO: make configurable
      if (sortedStopTimes.length > 0) sortedStopTimes = sortedStopTimes.slice(0, 5)
      // Do not show any patterns with no departures happening soon.
      const timeIsOverThreshold = sortedStopTimes[0].realtimeDeparture - getHomeTime(homeTimezone) > ONE_HOUR_IN_SECONDS * 3
      if (sortedStopTimes[0] && timeIsOverThreshold) {
        return null
      }
    }
    const routeName = route.shortName ? route.shortName : route.longName

    return (
      <div className='route-row'>
        {/* header row */}
        <div className='header'>
          {/* route name */}
          <div className='route-name'>
            {/* <button className='expansion-button' onClick={this._toggleExpandedView}> */}
            <b>{routeName}</b> To {pattern.headsign}
            {/* </button> */}
          </div>

          {/* next departure preview */}
          {stopTimes && stopTimes.length > 0 && (
            <div className='next-trip-preview'>
              {getFormattedStopTime(sortedStopTimes[0], homeTimezone, stopViewerArriving, timeFormat)}
            </div>
          )}

          {/* expansion chevron button */}
          <div className='expansion-button-container'>
            <button className='expansion-button' onClick={this._toggleExpandedView}>
              <Icon type={`chevron-${this.state.expanded ? 'up' : 'down'}`} />
            </button>
          </div>
        </div>

        {/* expanded view */}
        <VelocityTransitionGroup
          enter={{ animation: 'slideDown' }}
          leave={{ animation: 'slideUp' }}>
          {this.state.expanded && (
            <div>
              <div className='trip-table'>
                {/* trips table header row */}
                <div className='header'>
                  <div className='cell' />
                  <div className='cell time-column'>DEPARTURE</div>
                  <div className='cell status-column'>STATUS</div>
                </div>

                {/* list of upcoming trips */}
                {stopTimes && (
                  sortedStopTimes.map((stopTime, i) => {
                    return (
                      <div
                        className='trip-row'
                        style={{ display: 'table-row', marginTop: 6, fontSize: 14 }}
                        key={i}>
                        <div className='cell'>
                          To {stopTime.headsign}
                        </div>
                        <div className='cell time-column'>
                          {getFormattedStopTime(stopTime, homeTimezone, stopViewerArriving, timeFormat)}
                        </div>
                        <div className='cell status-column'>
                          {stopTime.realtimeState === 'UPDATED'
                            ? getStatusLabel(stopTime.departureDelay)
                            : <div
                              className='status-label'
                              style={{ backgroundColor: '#bbb' }}>
                              Scheduled
                            </div>
                          }
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </VelocityTransitionGroup>
      </div>
    )
  }
}

const ONE_HOUR_IN_SECONDS = 3600

function getHomeTime (homeTimezone) {
  const now = moment()
  return now.tz(homeTimezone).diff(now.clone().startOf('day'), 'seconds')
}

// helper method to generate stop time w/ status icon
function getFormattedStopTime (stopTime, homeTimezone, soonText = 'Due', timeFormat) {
  const now = moment()
  const serviceDay = moment(stopTime.serviceDay * 1000)
  const currentHomeTime = getHomeTime(homeTimezone)
  const differentDay = now.date() !== serviceDay.date()

  const userTimeZone = moment.tz.guess()
  const inHomeTimezone = homeTimezone && homeTimezone === userTimeZone
  // Determine whether to show departure as countdown (e.g. "5 min") or as HH:mm time
  const secondsUntilDeparture = stopTime.realtimeDeparture - currentHomeTime
  const departsInFuture = stopTime.realtimeDeparture > currentHomeTime
  // Show the exact time if the departure occurs after midnight and if the
  // departure happens within an hour.
  // FIXME: It's unclear why this was designed to show exact time after midnight.
  //  We should determine whether this is the desired behavior.
  const showCountdown = !differentDay &&
    secondsUntilDeparture < ONE_HOUR_IN_SECONDS &&
    departsInFuture

  // Use "soon text" (e.g., Due) if vehicle is approaching.
  const countdownString = secondsUntilDeparture < 60
    ? soonText
    : formatDuration(secondsUntilDeparture)
  // Only show timezone (e.g., PDT) if user is not in home time zone (e.g., user
  // in New York, but viewing a trip planner for service based in Los Angeles).
  const tzToDisplay = inHomeTimezone ? null : homeTimezone
  const formattedTime = formatStopTime(stopTime.realtimeDeparture, tzToDisplay, timeFormat)
  return (
    <div>
      <div style={{ float: 'left' }}>
        {stopTime.realtimeState === 'UPDATED'
          ? <Icon
            type='rss'
            style={{ color: '#888', fontSize: '0.8em', marginRight: 2 }} />
          : <Icon
            type='clock-o'
            style={{ color: '#888', fontSize: '0.8em', marginRight: 2 }} />
        }
      </div>
      <div style={{ marginLeft: 20, fontSize: differentDay ? 12 : 14 }}>
        {differentDay &&
          <div style={{ marginBottom: -4 }}>{serviceDay.format('dddd')}</div>
        }
        <div>
          {showCountdown
            // Show countdown string (e.g., 3 min or Due)
            ? countdownString
            // Show formatted time (with timezone if user is not in home timezone)
            : formattedTime
          }
        </div>
      </div>
    </div>
  )
}

function getRouteIdForPattern (pattern) {
  const patternIdParts = pattern.id.split(':')
  const routeId = patternIdParts[0] + ':' + patternIdParts[1]
  return routeId
}

// helper method to generate status label
function getStatusLabel (delay) {
  // late departure
  if (delay > 60) {
    return (
      <div className='status-label' style={{ backgroundColor: '#d9534f' }}>
        {formatDuration(delay)} Late
      </div>
    )
  }

  // early departure
  if (delay < -60) {
    return (
      <div className='status-label' style={{ backgroundColor: '#337ab7' }}>
        {formatDuration(Math.abs(delay))} Early
      </div>
    )
  }

  // on-time departure
  return (
    <div className='status-label' style={{ backgroundColor: '#5cb85c' }}>
      On Time
    </div>
  )
}

// connect to redux store

const mapStateToProps = (state, ownProps) => {
  return {
    autoRefreshStopTimes: state.otp.user.autoRefreshStopTimes,
    favoriteStops: state.otp.user.favoriteStops,
    homeTimezone: state.otp.config.homeTimezone,
    viewedStop: state.otp.ui.viewedStop,
    stopData: state.otp.transitIndex.stops[state.otp.ui.viewedStop.stopId],
    stopViewerArriving: state.otp.config.language.stopViewerArriving,
    timeFormat: getTimeFormat(state.otp.config)
  }
}

const mapDispatchToProps = {
  findStop,
  findStopTimesForStop,
  forgetStop,
  rememberStop,
  setLocation,
  setMainPanelContent,
  toggleAutoRefresh
}

export default connect(mapStateToProps, mapDispatchToProps)(StopViewer)