import React, { ComponentType, Suspense } from 'react'

/**
 * Wraps a component with suspense, assuming the wrapped component is lazily loaded.
 */
export default function withSuspense(
  WrappedComponent: ComponentType
): ComponentType {
  const suspensedComponent = (props: any): JSX.Element => (
    <Suspense fallback={<span />}>
      <WrappedComponent {...props} />
    </Suspense>
  )

  return suspensedComponent
}
