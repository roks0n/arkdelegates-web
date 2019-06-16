import React from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import styled from '@emotion/styled'
import BigNumber from 'bignumber.js'
import { COLOR_BLACK, COLOR_WHITE, API_URL } from '../constants'
import UpdateCard from '../components/UpdateCard'
import DelegateCard from '../components/DelegateCard'

const Title = styled.h2`
  color: ${COLOR_BLACK};
  font-weight: 500;
  margin-bottom: 0.3em;
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

  @media only screen and (max-width: 500px) {
    width: 100%;
  }
`

const Box = styled.div`
  background-color: ${COLOR_WHITE};
  width: 100%;
  border-radius: 5px;
  padding: 0.5em;
`

class Home extends React.Component {
  static async getInitialProps() {
    const results = await Promise.all([
      fetch(`${API_URL}contributions/?limit=5`),
      fetch(`${API_URL}news/?limit=5`),
      fetch(`${API_URL}delegates/?latest=1`),
    ])
    const [contributions, news, latest] = await Promise.all(results.map((res) => res.json()))
    return { contributions: contributions.data, news: news.data, latest: latest.data }
  }

  render() {
    const { contributions, news, latest } = this.props

    const contributionElements = contributions.map((contribution, key) => {
      return (
        <UpdateCard
          key={key}
          avatar={null}
          slug={contribution.delegate_name}
          title={contribution.title}
          delegate={contribution.delegate_name}
          routeName={'delegate-contributions'}
        />
      )
    })

    const newsElements = news.map((item, key) => {
      return (
        <UpdateCard
          key={key}
          avatar={null}
          slug={item.delegate_name}
          title={item.title}
          delegate={item.delegate_name}
          routeName={'delegate-news'}
        />
      )
    })

    const latestElements = latest.map((item, key) => {
      const voteWeight = new BigNumber(item.voting_power).div(100000000).toFormat(0)
      return (
        <DelegateCard
          key={key}
          avatar={null}
          slug={item.slug}
          name={item.name}
          payoutPercent={item.payout_percent}
          contributionsCount={item.contributions_count}
          isPrivate={item.is_private}
          votersCount={item.voters}
          voteWeight={voteWeight}
          isForging={item.rank <= 51 ? true : false}
          isAccountClaimed={item.user_id ? true : false}
        />
      )
    })

    return (
      <React.Fragment>
        <Head>
          <title>ARK delegates - Find and follow ARK delegates</title>
          <meta
            name="description"
            content="Find ARK delegates you want to support. See what they are doing, what have they done and follow their progress."
          />
        </Head>
        <Row>
          <TwoColumns>
            <Title>Latest contributions</Title>
            <Box>{contributionElements}</Box>
          </TwoColumns>

          <TwoColumns>
            <Title>Latest news</Title>
            <Box>{newsElements}</Box>
          </TwoColumns>
        </Row>
        <Row>
          <Title>New proposals</Title>
          <Box>{latestElements}</Box>
        </Row>
      </React.Fragment>
    )
  }
}

export default Home
