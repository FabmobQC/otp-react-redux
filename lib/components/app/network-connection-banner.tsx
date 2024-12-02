import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { FormattedMessage } from 'react-intl'
import React, { useRef } from 'react'
import styled from 'styled-components'

import { RED_ON_WHITE } from '../util/colors'

const containerClassname = 'network-connection-banner'
const timeout = 250

const TransitionStyles = styled.div`
  .${containerClassname} {
    background: ${RED_ON_WHITE};
    border-left: 1px solid #e7e7e7;
    border-right: 1px solid #e7e7e7;
    color: #fff;
    font-weight: 600;
    padding: 5px;
    position: absolute;
    text-align: center;
    top: 50px;
    width: 100%;
    // When banner is fully loaded, set z-index higher than nav so we're not seeing the nav border.
    z-index: 26;

    @media (max-width: 768px) {
      border: 0;
    }
  }
  .${containerClassname}-enter {
    opacity: 0;
    transform: translateY(-100%);
  }
  .${containerClassname}-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity ${timeout}ms ease-in;
  }
  .${containerClassname}-exit {
    opacity: 1;
    transform: translateY(0);
    z-index: 20;
  }
  .${containerClassname}-exit-active {
    opacity: 0;
    transform: translateY(-100%);
    transition: opacity ${timeout}ms ease-in, transform ${timeout}ms ease-in;
    z-index: 20;
  }
`
export const NetworkConnectionLostBanner = styled.div``

export const NetworkConnectionBanner = ({
  networkConnectionLost
}: {
  networkConnectionLost: boolean
}): JSX.Element => {
  const connectionLostBannerRef = useRef<HTMLDivElement>(null)
  return (
    <TransitionStyles>
      <TransitionGroup style={{ display: 'content' }}>
        {networkConnectionLost && (
          <CSSTransition
            classNames={containerClassname}
            nodeRef={connectionLostBannerRef}
            timeout={timeout}
          >
            <NetworkConnectionLostBanner
              aria-live="assertive"
              className={containerClassname}
              ref={connectionLostBannerRef}
              role="alert"
            >
              <FormattedMessage id="components.AppMenu.networkConnectionLost" />
            </NetworkConnectionLostBanner>
          </CSSTransition>
        )}
      </TransitionGroup>
    </TransitionStyles>
  )
}
