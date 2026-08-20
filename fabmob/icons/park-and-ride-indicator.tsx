import React from 'react'

export interface ParkAndRideIndicatorProps {
  size: string
}

export const ParkAndRideIndicator = ({
  size
}: ParkAndRideIndicatorProps): JSX.Element => {
  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: '#1565C0',
        borderRadius: '50%',
        color: '#FFF',
        display: 'flex',
        fontWeight: 700,
        height: size,
        justifyContent: 'center',
        width: size
      }}
    >
      P
    </div>
  )
}
