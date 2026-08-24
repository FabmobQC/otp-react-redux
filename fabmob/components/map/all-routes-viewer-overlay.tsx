import { connect } from 'react-redux'
import { LngLatBounds } from 'maplibre-gl'
import { useMap } from 'react-map-gl/maplibre'
import { util } from '@opentripplanner/base-map'
import polyline from '@mapbox/polyline'
import React, { useEffect } from 'react'
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

const extendBoundsWithCoordinates = (
  bounds: LngLatBounds | undefined,
  coordinates: any
): LngLatBounds | undefined => {
  if (typeof coordinates?.[0] === 'number') {
    const [lng, lat] = coordinates
    return bounds
      ? bounds.extend([lng, lat])
      : new LngLatBounds([lng, lat], [lng, lat])
  }
  return (coordinates || []).reduce(extendBoundsWithCoordinates, bounds)
}

const extendBoundsWithGeometry = (
  bounds: LngLatBounds | undefined,
  geometry: any
): LngLatBounds | undefined => {
  if (!geometry) return bounds
  if (geometry.type === 'GeometryCollection') {
    return (geometry.geometries || []).reduce(extendBoundsWithGeometry, bounds)
  }
  return extendBoundsWithCoordinates(bounds, geometry.coordinates)
}

const extendBoundsWithRoute = (
  bounds: LngLatBounds | undefined,
  routeData: any
): LngLatBounds | undefined => {
  const patterns: any[] = Object.values(routeData?.patterns || {})
  let newBounds = bounds
  patterns.forEach((ptn) => {
    if (ptn?.geometry?.points) {
      polyline.decode(ptn.geometry.points).forEach(([lat, lng]) => {
        newBounds = newBounds
          ? newBounds.extend([lng, lat])
          : new LngLatBounds([lng, lat], [lng, lat])
      })
    }
    ptn?.stops?.forEach((stop: any) => {
      const geoJson = stop?.geometries?.geoJson
      if (geoJson) {
        newBounds = extendBoundsWithGeometry(newBounds, geoJson)
      }
    })
  })
  return newBounds
}

const AllRoutesViewerOverlay = (props: AllRoutesViewerOverlayProps) => {
  const { routesData } = props
  const { current } = useMap()
  const isMultiRoute = routesData.length > 1

  useEffect(() => {
    if (!isMultiRoute || !current) {
      return undefined
    }

    const bounds = routesData.reduce(extendBoundsWithRoute, undefined)

    let timeout: ReturnType<typeof setTimeout> | undefined
    if (bounds) {
      const fitBounds = () => util.fitMapBounds(current, bounds)
      fitBounds()
      timeout = setTimeout(fitBounds, 250)
    }

    return () => clearTimeout(timeout)
  }, [routesData, isMultiRoute, current])

  return routesData.map((routeData) => {
    return (
      <RouteViewerOverlay
        clipToPatternStops={false}
        key={routeData.id}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        mapCenterCallback={() => {}}
        routeData={routeData}
        shouldNotCenterMap={isMultiRoute}
      />
    )
  })
}

export default connect(mapStateToProps)(AllRoutesViewerOverlay)
