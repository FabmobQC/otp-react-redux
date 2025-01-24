import { connect } from 'react-redux'
import { Layer, Source } from 'react-map-gl'
import React, { useState } from 'react'

import { fetchAdministrativeRegions } from '../../actions/fabmob'

interface AdministrativeRegionsLayerProps {
  administrativeRegions: string | undefined
  fetchAdministrativeRegions: () => void
}

const AdministrativeRegionsLayer = ({
  administrativeRegions,
  fetchAdministrativeRegions
}: AdministrativeRegionsLayerProps) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  if (isFirstLoad) {
    fetchAdministrativeRegions()
    setIsFirstLoad(false)
  }
  if (!administrativeRegions) {
    return null
  }
  return (
    <Source
      data={administrativeRegions}
      id="administrative-regions-sources"
      type="geojson"
    >
      <Layer
        id="administrative-regions"
        paint={{
          'line-color': '#473822'
        }}
        type="line"
      />
    </Source>
  )
}

const mapStateToProps = (state: any) => {
  const { administrativeRegions } = state.fabmob
  return {
    administrativeRegions
  }
}

const mapDispatchToProps = {
  fetchAdministrativeRegions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdministrativeRegionsLayer)
