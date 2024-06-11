import React from 'react'

import CommunautoIcon from './communauto.png'

export interface CommunautoLogoProps {
  size: number
}

export const CommunautoLogo = ({ size }: CommunautoLogoProps): JSX.Element => {
  return (
    <img
      alt="Communauto"
      src={CommunautoIcon}
      style={{
        borderRadius: '100%',
        height: size,
        width: size
      }}
    />
  )
}
