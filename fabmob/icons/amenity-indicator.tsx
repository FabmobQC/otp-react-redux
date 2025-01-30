import React from 'react'

import { AmenityType } from '../reducers/create-fabmob-reducer'

import HospitalImage from './hospital.png'
import SchoolImage from './school.png'
import ShoppingCartImage from './shopping-cart.png'

interface AmenityIndicatorConfig {
  alt: string
  backgroundColor: string
  image: string
}

const amenityIndicatorConfigsMaps: Record<AmenityType, AmenityIndicatorConfig> =
  {
    Education: {
      alt: 'school',
      backgroundColor: '#FFF',
      image: SchoolImage
    },
    'Grocery Store': {
      alt: 'shopping',
      backgroundColor: '#FFF',
      image: ShoppingCartImage
    },
    'Health center': {
      alt: 'hospital',
      backgroundColor: '#FFF',
      image: HospitalImage
    }
  }

export interface AmenityIndicatorProps {
  amenityType: AmenityType
  size: string
}

export const AmenityIndicator = ({
  amenityType,
  size
}: AmenityIndicatorProps): JSX.Element => {
  const config = amenityIndicatorConfigsMaps[amenityType]
  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: config.backgroundColor,
        borderRadius: '50%',
        display: 'flex',
        height: size,
        justifyContent: 'center',
        overflow: 'hidden',
        width: size
      }}
    >
      <img
        alt={config.alt}
        src={config.image}
        style={{
          height: '55%',
          objectFit: 'cover',
          width: '55%'
        }}
      />
    </div>
  )
}
