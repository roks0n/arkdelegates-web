import React from 'react'
import fetch from 'isomorphic-unfetch'
import styled from '@emotion/styled'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import { COLOR_BLACK, COLOR_WHITE } from '../constants'
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

const ViewMore = styled.a`
  display: flex;
  justify-content: center;
  color: ${COLOR_BLACK};
  text-decoration: none;
  text-align: center;
  margin-top: 0.5em;
`

class Home extends React.Component {
  static async getInitialProps() {
    const results = await Promise.all([
      fetch('https://arkdelegates.io/api/contributions/?limit=5'),
      fetch('https://arkdelegates.io/api/news/?limit=5'),
      fetch('https://arkdelegates.io/api/delegates/?latest=1'),
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
          slug={contribution.delegate_slug}
          title={contribution.title}
          delegate={contribution.delegate_name}
        />
      )
    })

    const newsElements = news.map((item, key) => {
      return (
        <UpdateCard
          key={key}
          avatar={null}
          slug={item.delegate_slug}
          title={item.title}
          delegate={item.delegate_name}
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
        />
      )
    })

    return (
      <React.Fragment>
        <Row>
          <TwoColumns>
            <Title>Latest contributions</Title>
            <Box>{contributionElements}</Box>
            <Link href="/contributions" passHref>
              <ViewMore>View more</ViewMore>
            </Link>
          </TwoColumns>

          <TwoColumns>
            <Title>Latest updates</Title>
            <Box>{newsElements}</Box>
            <Link href="/news" passHref>
              <ViewMore>View more</ViewMore>
            </Link>
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
