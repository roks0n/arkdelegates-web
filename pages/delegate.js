import React from 'react'
import Head from 'next/head'
import Error from 'next/error'
import fetch from 'isomorphic-unfetch'
import styled from '@emotion/styled'
import BigNumber from 'bignumber.js'
import logo from '../components/ark-logo-light-bg.svg'
import TabNav from '../components/TabNav'
import DelegateUpdateCard from '../components/DelegateUpdateCard'
import { Icon } from 'react-icons-kit'
import { checkmark } from 'react-icons-kit/icomoon/checkmark'
import { ic_info } from 'react-icons-kit/md/ic_info'
import { cross } from 'react-icons-kit/icomoon/cross'
import { certificate } from 'react-icons-kit/fa/certificate'
import {
  COLOR_BLACK,
  COLOR_WHITE,
  COLOR_LIGHT_BLUE,
  COLOR_RED,
  COLOR_GREEN,
  API_URL,
} from '../constants'
import showdown from 'showdown'
import Floater from 'react-floater'

const Title = styled.h2`
  color: ${COLOR_BLACK};
  font-weight: 500;
  margin: 0;
`

const Address = styled.div`
  font-size: 0.9em;
  margin-top: 0.3em;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  white-space: nowrap;
`

const Row = styled.div`
  box-sizing: border-box;
  display: flex;
  flex: 0 1 auto;
  flex-direction: row;
  flex-wrap: wrap;
`

const TwoColumns = styled.div`
  width: 50%;
  padding-right: 0.5em;
  padding-left: 0.5em;

  &:first-of-type {
    padding-left: 0em;
  }

  &:last-child {
    padding-right: 0em;
  }

  @media only screen and (max-width: 700px) {
    width: 100%;
    padding-right: 0;
    padding-left: 0;
  }
`

const Box = styled.div`
  background-color: ${COLOR_WHITE};
  width: 100%;
  border-radius: 5px;
  padding: 0.5em;
  margin-top: 1.5em;
`

const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 1.5em;
`

const Image = styled.div`
  width: 80px;
  height: 80px;
  border: 1px solid ${COLOR_LIGHT_BLUE};
  margin-right: 1em;
  border-radius: 4px;
  background-size: 100%;
  background-position: center center;
  background-color: #fbfbfb;
  background-repeat: no-repeat;
  flex-shrink: 0;

  ${({ image }) => `background-image: url(${image ? image : logo});`}
  ${({ image }) => !image && `background-size: 80%;`}
`

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  border-bottom: 1px solid ${COLOR_LIGHT_BLUE};
  padding-bottom: 0.5em;
  padding-top: 0.5em;
  font-size: 0.9em;

  &:first-of-type {
    padding-top: 0em;
  }

  &:last-child {
    padding-bottom: 0em;
    border-bottom: 0;
  }

  @media only screen and (max-width: 750px) {
    border-bottom: 0;
  }
`

const Data = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1em;

  @media only screen and (max-width: 700px) {
    width: 20%;
    padding: 0.5em;
  }

  @media only screen and (max-width: 400px) {
    width: 33.333%;
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

const TabContainer = styled.div`
  width: 100%;
  background-color: ${COLOR_WHITE};
  border-radius: 5px;
  margin-top: 1.5em;
`

const Content = styled.div`
  padding: 1em;

  a {
    text-decoration: none;
    color: ${COLOR_RED};
  }

  > {
    padding: 1em;
  }

  > * > p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6:first-of-type {
    margin-top: 0;
  }

  li {
    margin: 0.3em 0;
  }

  img {
    width: 100%;
  }
`

class Delegate extends React.Component {
  static async getInitialProps({ ctx }) {
    const { query, res } = ctx

    if (!query.slug) {
      if (res) {
        res.statusCode = 404
      }
      return {}
    }
    // TODO: do requests in parallel
    const delegate = await fetch(`${API_URL}delegates/${query.slug}/`).then((res) => res.json())

    let pageType = 'proposal'
    let content = null
    if (ctx.asPath.includes('contributions')) {
      const contributions = await fetch(`${API_URL}contributions?delegate_slug=${query.slug}`).then(
        (res) => res.json()
      )
      content = contributions.data
      pageType = 'contributions'
    } else if (ctx.asPath.includes('news')) {
      const contributions = await fetch(`${API_URL}news?delegate_slug=${query.slug}`).then((res) =>
        res.json()
      )
      content = contributions.data
      pageType = 'news'
    }

    return {
      name: delegate.name,
      payoutPercent: delegate.payout_percent,
      payoutInterval: delegate.payout_interval,
      payoutMin: delegate.payout_minimum,
      payoutMax: delegate.payout_maximum,
      contributionsCount: delegate.contributions_count,
      isPrivate: delegate.is_private,
      voters: delegate.voters,
      nonZeroVoters: delegate.voters_not_zero_balance,
      votingPower: delegate.voting_power,
      rank: delegate.rank,
      proposal: delegate.proposal,
      address: delegate.address,
      pathName: ctx.pathname,
      slug: ctx.query.slug,
      isAccountClaimed: delegate.user_id || false,
      content,
      pageType,
    }
  }

  render() {
    if (!this.props.address) return <Error statusCode={404} />

    const {
      name,
      address,
      payoutPercent,
      contributionsCount,
      isPrivate,
      voters,
      nonZeroVoters,
      votingPower,
      rank,
      payoutInterval,
      payoutMin,
      payoutMax,
      proposal,
      pathName,
      slug,
      isAccountClaimed,
      content,
      pageType,
    } = this.props

    const voteWeight = new BigNumber(votingPower).div(100000000).toFormat(0)
    const payoutMinimum = payoutMin ? new BigNumber(payoutMin).div(100000000).toFormat() : 0
    const payoutMaximum = payoutMax ? new BigNumber(payoutMax).div(100000000).toFormat() : 0

    const tabItems = [
      {
        name: 'Proposal',
        href: `${pathName}/${slug}`,
        routeName: 'delegate',
        slug: slug,
      },
      {
        name: 'Contributions',
        href: `${pathName}/${slug}/contributions`,
        routeName: 'delegate-contributions',
        slug: slug,
      },
      {
        name: 'News',
        href: `${pathName}/${slug}/news`,
        routeName: 'delegate-news',
        slug: slug,
      },
    ]

    let tabContent = null
    if (content && content.length) {
      tabContent = content.map((item, key) => {
        const content = item.description || item.message
        return (
          <DelegateUpdateCard
            key={key}
            title={item.title}
            content={content}
            created={item.created}
          />
        )
      })
    } else if (content && !content.length) {
      tabContent = 'Not data yet.'
    } else {
      const markdown = new showdown.Converter()
      const proposalHtml = markdown.makeHtml(
        proposal || `This delegate hasn't written or published its proposal yet.`
      )
      tabContent = <div dangerouslySetInnerHTML={{ __html: proposalHtml }} />
    }

    const voteTooltip = (
      <Floater
        content={<div>This number excludes all voters with 0 ARK in their wallet</div>}
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
          size={12}
          icon={ic_info}
          style={{ color: COLOR_BLACK, marginLeft: '2px', position: 'relative', top: '-1px' }}
        />
      </Floater>
    )

    const verifiedTooltip = isAccountClaimed && (
      <Floater
        content={<div>This delegate's account has been claimed</div>}
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
          size={15}
          icon={certificate}
          style={{ color: COLOR_RED, marginLeft: '2px', position: 'relative', top: '-7px' }}
        />
      </Floater>
    )

    let metaTitle = null
    let metaDescription = null
    switch (pageType) {
      case 'news':
        metaTitle = `Delegate ${name}'s news @ ARKdelegates.io`
        metaDescription = `Check if delegate ${name} posted any news or updates recently.`
        break
      case 'contributions':
        metaTitle = `Delegate ${name}'s contributions @ ARKdelegates.io`
        metaDescription = `Check if delegate ${name} made any new contributions.`
        break
      default:
        metaTitle = `Delegate ${name} @ ARKdelegates.io`
        metaDescription = `Check what ${name} delegate has done for the Ark community, how many nodes it runs and what&#39;s the proposal.`
        break
    }

    return (
      <React.Fragment>
        <Head>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
        </Head>
        <Item>
          <Image image={null} />
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <Title>
              {name}
              {verifiedTooltip}
            </Title>
            <Address>
              Address: <span>{address}</span>
            </Address>
          </div>
        </Item>
        <Row>
          <TwoColumns>
            <Box>
              <Container>
                <Data>
                  <DataInner>
                    <H4>Rank</H4>
                    <P>{rank}</P>
                  </DataInner>
                </Data>
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
                    <H4>Voters</H4>
                    <P>
                      {voters} ({nonZeroVoters || 0} {voteTooltip})
                    </P>
                  </DataInner>
                </Data>
                <Data>
                  <DataInner>
                    <H4>Vote weight</H4>
                    <P>{voteWeight}</P>
                  </DataInner>
                </Data>
                <Data>
                  <DataInner>
                    <H4>Forging</H4>
                    <P>
                      {rank <= 51 ? (
                        <Icon size={15} icon={checkmark} style={{ color: COLOR_GREEN }} />
                      ) : (
                        <Icon size={15} icon={cross} style={{ color: COLOR_RED }} />
                      )}
                    </P>
                  </DataInner>
                </Data>
              </Container>
            </Box>
          </TwoColumns>
          <TwoColumns>
            <Box>
              <Container>
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
                    <H4>Payout min</H4>
                    <P>{payoutMinimum}</P>
                  </DataInner>
                </Data>
                <Data>
                  <DataInner>
                    <H4>Payout max</H4>
                    <P>{payoutMaximum}</P>
                  </DataInner>
                </Data>
                <Data>
                  <DataInner>
                    <H4>Payout interval</H4>
                    <P>{payoutInterval ? payoutInterval : `unknown`}</P>
                  </DataInner>
                </Data>
              </Container>
            </Box>
          </TwoColumns>
        </Row>
        <Row>
          <TabContainer>
            <TabNav items={tabItems} />
            <Content>{tabContent}</Content>
          </TabContainer>
        </Row>
      </React.Fragment>
    )
  }
}

export default Delegate
