import styled from 'styled-components'

export const TouristicPlaceIndicator = styled.div<{
  color: string
  size: string
}>`
  background-color: ${({ color }) => color};
  border: 2px solid black;
  border-radius: 50%;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`
