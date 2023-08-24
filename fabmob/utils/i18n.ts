import { IntlShape } from 'react-intl'

export const getFormattedTaxiAssetType = (
  type: string,
  intl: IntlShape
): string => {
  switch (type) {
    case 'taxi-registry-standard':
      return intl.formatMessage({ id: 'common.taxiAssetTypes.standard' })
    case 'taxi-registry-minivan':
      return intl.formatMessage({ id: 'common.taxiAssetTypes.minivan' })
    case 'taxi-registry-special-need':
      return intl.formatMessage({ id: 'common.taxiAssetTypes.special' })
    default:
      return ''
  }
}
