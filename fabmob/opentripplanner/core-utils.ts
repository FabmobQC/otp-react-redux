import coreUtils from '@opentripplanner/core-utils'

const customDefaultQueryParams: Record<string, string | number> = {
  taxiAssetType: 'taxi-registry-standard'
}

const isNotDefaultQuery = (currentQuery: any, config: any) => {
  const baseIsNotDefaultQuery = coreUtils.query.isNotDefaultQuery(
    currentQuery,
    config
  )
  const customIsNotDefaultQuery = Object.entries(
    customDefaultQueryParams
  ).reduce((acc, [key, value]) => acc || currentQuery[key] != value, false)
  return baseIsNotDefaultQuery || customIsNotDefaultQuery
}

export default {
  ...coreUtils,
  query: {
    ...coreUtils.query,
    isNotDefaultQuery
  }
}
