import styled from '@emotion/styled'
import Floater from 'react-floater'
import { Link } from '../routes'
import { Icon } from 'react-icons-kit'
import { checkmark } from 'react-icons-kit/icomoon/checkmark'
import { cross } from 'react-icons-kit/icomoon/cross'
import { certificate } from 'react-icons-kit/fa/certificate'
import logo from './ark-logo-light-bg.svg'
import { COLOR_BLACK, COLOR_LIGHT_BLUE, COLOR_RED, COLOR_GREEN } from '../constants'

const Container = styled.a`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  border-bottom: 1px solid ${COLOR_LIGHT_BLUE};
  padding-bottom: 0.5em;
  padding-top: 0.5em;
  font-size: 0.9em;
  cursor: pointer;

  text-decoration: none;
  color: ${COLOR_BLACK};

  &:first-of-type {
    padding-top: 0em;
  }

  &:last-child {
    padding-bottom: 0em;
    border-bottom: 0;
  }
`

const Image = styled.div`
  width: 60px;
  height: 60px;
  border: 1px solid ${COLOR_LIGHT_BLUE};
  margin-right: 0.5em;
  border-radius: 4px;
  background-size: 100%;
  background-position: center center;
  background-color: #fbfbfb;
  background-repeat: no-repeat;
  flex-shrink: 0;

  ${({ image }) => `background-image: url(${image ? image : logo});`}
  ${({ image }) => !image && `background-size: 80%;`}

  @media only screen and (max-width: 750px) {
    border-radius: 4px 0 0 4px;
    width: 45px;
    height: 45px;
    border: 0;
  }
`

const Item = styled.div`
  width: 180px;
  display: flex;
  align-items: center;

  @media only screen and (max-width: 750px) {
    width: 100%;
    margin-left: 0.25em;
    margin-right: 0.25em;
    background: #fbfbfb;
    border-radius: 4px;
  }
`

const Data = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1em;
  margin-left: auto;

  @media only screen and (max-width: 750px) {
    width: 13%;
    align-content: center;
    margin: 0.25em;
    padding: 0.5em;
  }

  @media only screen and (max-width: 550px) {
    width: 30%;
    align-content: center;
    margin: 0.25em;
    padding: 0.5em;
  }
`

const DataInner = styled.div`
  width: 100%;
`

const H4 = styled.h4`
  font-weight: 500;
  margin: 0;
  padding: 0;
  text-align: center;
  margin-bottom: 0.5em;

  @media only screen and (max-width: 750px) {
    margin-bottom: 0.25em;
  }
`

const P = styled.p`
  font-size: 1em;
  font-weight: 300;
  text-align: center;
  margin: 0;
`

function DelegateCard({
  avatar,
  name,
  slug,
  payoutPercent,
  contributionsCount,
  isPrivate,
  votersCount,
  voteWeight,
  isForging,
  isAccountClaimed,
  rank,
}) {
  const verifiedTooltip = isAccountClaimed && (
    <Floater
      content={<span>This delegate's account has been claimed</span>}
      offset={3}
      disableHoverToClick
      event={'hover'}
      eventDelay={0}
      styles={{
        arrow: {
          spread: 10,
          length: 7,
        },
        container: {
          padding: '0.5em',
          height: 'auto',
          minHeight: 'auto',
          color: COLOR_BLACK,
          fontSize: '0.8em',
          borderRadius: '4px',
        },
        floater: {
          filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.1))',
          maxWidth: 250,
        },
      }}
    >
      <Icon
        size={8}
        icon={certificate}
        style={{ color: COLOR_RED, marginLeft: '2px', position: 'relative', top: '-7px' }}
      />
    </Floater>
  )

  return (
    <Link route={'delegate'} params={{ slug }} passHref>
      <Container>
        <Item>
          <Image image={avatar} />
          <div>
            {rank ? `${rank}. ` : null}
            {name}
            {verifiedTooltip}
          </div>
        </Item>
        <Data>
          <DataInner>
            <H4>Contributes</H4>
            <P>
              {contributionsCount > 0 ? (
                <Icon size={15} icon={checkmark} style={{ color: COLOR_GREEN }} />
              ) : (
                <Icon size={15} icon={cross} style={{ color: COLOR_RED }} />
              )}
            </P>
          </DataInner>
        </Data>
        <Data>
          <DataInner>
            <H4>Shares rewards</H4>
            <P>
              {isPrivate ? (
                <Icon size={15} icon={cross} style={{ color: COLOR_RED }} />
              ) : (
                <Icon size={15} icon={checkmark} style={{ color: COLOR_GREEN }} />
              )}
            </P>
          </DataInner>
        </Data>
        <Data>
          <DataInner>
            <H4>Payout</H4>
            <P>{payoutPercent ? `${payoutPercent}%` : `unknown`}</P>
          </DataInner>
        </Data>
        <Data>
          <DataInner>
            <H4>Voters</H4>
            <P>{votersCount}</P>
          </DataInner>
        </Data>
        <Data>
          <DataInner>
            <H4>Vote weight</H4>
            <P>{voteWeight}Ѧ</P>
          </DataInner>
        </Data>
        <Data>
          <DataInner>
            <H4>Forging</H4>
            <P>
              {isForging ? (
                <Icon size={15} icon={checkmark} style={{ color: COLOR_GREEN }} />
              ) : (
                <Icon size={15} icon={cross} style={{ color: COLOR_RED }} />
              )}
            </P>
          </DataInner>
        </Data>
      </Container>
    </Link>
  )
}

export default DelegateCard
