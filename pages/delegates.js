import React from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import styled from '@emotion/styled'
import BigNumber from 'bignumber.js'
import { COLOR_BLACK, COLOR_WHITE, API_URL } from '../constants'
import DelegateCard from '../components/DelegateCard'
import InfiniteScroll from 'react-infinite-scroller'

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

const Box = styled.div`
  background-color: ${COLOR_WHITE};
  width: 100%;
  border-radius: 5px;
  padding: 0.5em;
`

const Loading = styled.div`
  color: ${COLOR_BLACK},
  padding: 1em;
  margin: 1em 0 0.5em;
  text-align: center;
  width: 100%;
`

class Delegates extends React.Component {
  state = {
    currentPage: 1,
    totalPages: null,
    isLoading: false,
    delegates: [],
  }

  static async getInitialProps() {
    const delegates = await fetch(`${API_URL}delegates/?page=1`).then((res) => res.json())
    return {
      delegates: delegates.data,
      currentPage: delegates.current_page,
      totalPages: delegates.total_pages,
    }
  }

  componentDidMount() {
    const { delegates, currentPage, totalPages } = this.props
    if (!this.state.delegates.length) {
      this.setState({ delegates, currentPage, totalPages })
    }
  }

  async loadNextPage() {
    const delegates = await fetch(`${API_URL}delegates/?page=${this.state.currentPage + 1}`).then(
      (res) => res.json()
    )
    this.setState({
      delegates: [...this.state.delegates, ...delegates.data],
      currentPage: delegates.current_page,
      totalPages: delegates.total_pages,
    })
  }

  render() {
    const { delegates } = this.props
    const delegateItems = this.state.delegates.length ? this.state.delegates : delegates

    const delegatesElements = []
    for (const item of delegateItems) {
      if (!item.slug) {
        // TODO: there's a delegate registered with `@` which resolved to a `null` slug causing
        // problem - this should be looked at
        continue
      }

      const voteWeight = new BigNumber(item.voting_power).div(100000000).toFormat(0)
      delegatesElements.push(
        <DelegateCard
          key={item.id}
          avatar={null}
          rank={item.rank}
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
    }

    return (
      <React.Fragment>
        <Head>
          <title>List of ARK delegates @ ARKdelegates.io</title>
          <meta
            name="description"
            content="List of all registered ARK delegates. Compare them, check their contributions, stats and more!"
          />
        </Head>
        <Row>
          <Title>List of all Ark delegates</Title>
          <Box>
            <InfiniteScroll
              pageStart={0}
              loadMore={() => this.loadNextPage()}
              hasMore={true || false}
              loader={<Loading key={0}>Loading ...</Loading>}
            >
              {delegatesElements}
            </InfiniteScroll>
          </Box>
        </Row>
      </React.Fragment>
    )
  }
}

export default Delegates
