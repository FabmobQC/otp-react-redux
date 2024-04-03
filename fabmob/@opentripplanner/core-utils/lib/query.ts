import * as query from '@opentripplanner/core-utils/lib/query'

export const planParamsToQueryAsync = async (
  params: Record<string, any>,
  config: Record<string, unknown> = {}
): Promise<any> => {
  const result = await query.planParamsToQueryAsync(params, config)
  if (params.additionalPlaces === undefined) {
    result.additionalPlaces = []
  } else {
    result.additionalPlaces = await Promise.all(
      params.additionalPlaces?.map(async (place: unknown) => {
        params.fromPlace = place
        return (await query.planParamsToQueryAsync(params, config)).from
      })
    )
  }
  result.additionalPlacesWaitingTimes =
    params.additionalPlacesWaitingTimes?.map(parseFloat) ?? []
  return result
}
