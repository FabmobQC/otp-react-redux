import { connect } from 'react-redux'
import React from 'react'
import RouteViewerOverlay from '@opentripplanner/route-viewer-overlay'

const getRouteData = (state: any) => {
  const { patternId, routeId } = state.otp.ui.viewedRoute || {}
  const { routes } = state.otp.transitIndex

  // For pattern view
  if (patternId) {
    const route = routeId && routes ? routes[routeId] : {}
    if (route.pending) {
      // fixes crash when accessing the pattern's page directly from a url
      return []
    }
    const filteredPatterns = {
      // hide all other patterns
      [patternId]: routes[routeId]?.patterns?.[patternId]
    }
    const { patterns, vehicles, ...otherRouteData } = route
    return [{ ...otherRouteData, patterns: filteredPatterns }]
  }

  // For actual route view
  const allRoutes = routes ? Object.values(routes) : []
  const { viewedRoutes } = state.fabmob
  return allRoutes.filter(
    (routeData) =>
      routeData.patterns !== undefined && viewedRoutes?.has(routeData.id)
  )
}

const mapStateToProps = (state: any) => {
  return {
    routesData: getRouteData(state)
  }
}

interface AllRoutesViewerOverlayProps {
  routesData: any[]
}

const AllRoutesViewerOverlay = (props: AllRoutesViewerOverlayProps) => {
  const { routesData } = props
  const shouldNotCenterMap = routesData.length > 1
  return routesData.map((routeData, index) => {
    return (
      <RouteViewerOverlay
        clipToPatternStops={false}
        key={index}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        mapCenterCallback={() => {}}
        routeData={routeData}
        shouldNotCenterMap={shouldNotCenterMap}
      />
    )
  })
}

export default connect(mapStateToProps)(AllRoutesViewerOverlay)
