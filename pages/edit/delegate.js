import styled from '@emotion/styled'
import React from 'react'
import Router from 'next/router'
import fetch from 'isomorphic-unfetch'
import nextCookie from 'next-cookies'
import { API_URL } from '../../constants'
import { withAuthSync, logout } from '../../modules/auth'
import EditItem from '../../components/EditItem'

const PayoutsForm = styled.form`
  margin-bottom: 3em;

  label {
    text-align: left;
    display: block;
    width: 150px;
    margin-bottom: 0.25em;
  }

  input[type='number'] {
    width: 150px;
    display: block;
    margin-bottom: 1em;
    padding: 0.5em;
    border: 1px solid #cacaca;
  }

  input[type='submit'],
  button[type='submit'] {
    float: right;
    padding: 0.5em 0.5em 0.45em;
  }
`

const PayoutsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`
const PayoutGroup = styled.div``

const ErrorMsg = styled.div`
  width: 150px;
  text-align: left;
  position: relative;
  top: -16px;
  background: #cc3300;
  padding: 5px;
  color: white;
  font-size: 0.85em;
`

const ProposalForm = styled.form`
  label {
    text-align: left;
    display: block;
    width: 100%;
    margin-bottom: 0.25em;
  }

  textarea {
    width: 100%;
    display: block;
    margin-bottom: 1em;
    padding: 0.5em;
    border: 1px solid #cacaca;
  }

  input[type='submit'],
  button[type='submit'] {
    float: right;
    padding: 0.5em 0.5em 0.45em;
  }
`

const TabContainer = styled.ul`
  display: flex;
  list-style: none;
  margin-left: 0;
  padding: 0;
  margin-bottom: 1em;
`

const TabElement = styled.li`
  float: left;
  margin-right: 1em;
  cursor: pointer;
  font-weight: ${props => props.isSelected ? 'bold' : 'normal'};
`

const CreateButton = styled.div`
  margin: 0 auto 1em;
  padding: 0.5em 1em;
  text-align: center;
  background: #cacaca;
  display: table;
  cursor: pointer;
`

const Label = styled.div`
  font-size: 0.9em;
  margin-bottom: 0.5em;
`

class EditDelegate extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handlePayoutSubmit = this.handlePayoutSubmit.bind(this)
    this.handleProposalSubmit = this.handleProposalSubmit.bind(this)
  }

  async handleChange(event) {
    if (event.target.type === 'checkbox') {
      await this.setState({ [event.target.name]: event.target.checked })
    } else {
      await this.setState({ [event.target.name]: event.target.value })
    }
  }

  async handlePayoutSubmit(event) {
    event.preventDefault()
    this.setState({ errorsPayout: {} })

    try {
      const [data, response] = await fetch(`${API_URL}delegates/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.props.token}`,
        },
        body: JSON.stringify({
          payout_percent: this.state.payoutPercent,
          payout_minimum: this.state.payoutMin,
          payout_maximum: this.state.payoutMax,
          payout_interval: this.state.payoutInterval,
          is_private: this.state.isPrivate,
        }),
      }).then(async (res) => [await res.json(), res])

      if (response.status === 201) {
        alert('Payout info updated')
      } else if (response.status >= 400) {
        this.setState({ errorsPayout: data })
      }
    } catch (error) {
      console.error('You have an error in your code or there are Network issues.', error)
    }
  }

  async handleProposalSubmit(event) {
    event.preventDefault()
    this.setState({ errorsProposal: {} })

    try {
      const [data, response] = await fetch(`${API_URL}delegates/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.props.token}`,
        },
        body: JSON.stringify({ proposal: this.state.proposal }),
      }).then(async (res) => [await res.json(), res])

      if (response.status === 201) {
        alert('Proposal updated')
      } else if (response.status >= 400) {
        this.setState({ errorsProposal: data })
      }
    } catch (error) {
      console.error('You have an error in your code or there are Network issues.', error)
    }
  }

  async addNews() {
    const news = this.state.news
    const newNews = [{ id: null, title: '', message: '', canEdit: true }].concat(news)
    this.setState({ news: newNews, showAddNews: false })
  }

  async addContributions() {
    const contributions = this.state.contributions
    const newContributions = [{ id: null, title: '', description: '', canEdit: true }].concat(
      contributions
    )
    this.setState({ contributions: newContributions, showAddContributions: false })
  }

  static async getInitialProps(ctx) {
    const { token, username } = nextCookie(ctx)
    const url = `${API_URL}delegates/${username}/`

    const redirectOnError = () => {
      if (process.browser) {
        Router.push('/auth/login')
      } else {
        ctx.res.writeHead(302, { Location: '/auth/login' })
        ctx.res.end()
      }
    }

    try {
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        const delegate = await response.json()
        const results = await Promise.all([
          fetch(`${API_URL}news/?delegate_slug=${delegate.slug}`),
          fetch(`${API_URL}contributions/?delegate_slug=${delegate.slug}`),
        ])
        const [news, contributions] = await Promise.all(results.map((res) => res.json()))
        return { delegate, token, news: news.data, contributions: contributions.data }
      }

      // https://github.com/developit/unfetch#caveats
      return redirectOnError()
    } catch (error) {
      // Implementation or Network error
      return redirectOnError()
    }
  }

  async componentWillMount() {
    const {
      proposal,
      payout_percent,
      payout_minimum,
      payout_maximum,
      payout_interval,
      payout_covering_fee,
      is_private,
    } = this.props.delegate

    this.setState({
      isPrivate: is_private,
      payoutPercent: payout_percent,
      payoutMin: payout_minimum,
      payoutMax: payout_maximum,
      payoutInterval: payout_interval,
      payoutCoveringFee: payout_covering_fee,
      proposal,
      errorsPayout: {},
      errorsProposal: {},
      selectedTab: 'proposal',
      news: this.props.news,
      contributions: this.props.contributions,
      showAddNews: true,
      showAddContributions: true,
    })
  }

  async refreshNews() {
    const news = await fetch(`${API_URL}news/?delegate_slug=${this.props.delegate.slug}`).then(
      (res) => res.json()
    )
    this.setState({ news: news.data })
  }

  async refreshContributions() {
    const contributions = await fetch(
      `${API_URL}contributions/?delegate_slug=${this.props.delegate.slug}`
    ).then((res) => res.json())
    this.setState({ contributions: contributions.data })
  }

  render() {
    const proposalEl = (
      <ProposalForm onSubmit={this.handleProposalSubmit}>
        <textarea
          rows="15"
          name="proposal"
          value={this.state.proposal}
          onChange={this.handleChange}
        />
        <button type="submit">Save proposal</button>
      </ProposalForm>
    )

    const newsEl = (
      <React.Fragment>
        {this.state.showAddNews ? (
          <CreateButton onClick={() => this.addNews()}>Add news</CreateButton>
        ) : null}
        {this.state.news.map((item, key) => {
          return (
            <EditItem
              key={item.id || key}
              id={item.id}
              delegateSlug={item.delegate_name}
              title={item.title}
              description={item.message}
              created={item.created}
              token={this.props.token}
              type="news"
              canEdit={item.canEdit || false}
              onDeleted={() => {
                this.setState({ showAddNews: true })
                this.refreshNews()
              }}
              onCreated={() => {
                this.setState({ showAddNews: true })
                this.refreshNews()
              }}
            />
          )
        })}
      </React.Fragment>
    )

    const contributionsEl = (
      <React.Fragment>
        {this.state.showAddContributions ? (
          <CreateButton onClick={() => this.addContributions()}>Add contribution</CreateButton>
        ) : null}
        {this.state.contributions.map((contribution, key) => {
          return (
            <EditItem
              key={contribution.id || key}
              id={contribution.id}
              delegateSlug={contribution.delegate_name}
              title={contribution.title}
              description={contribution.description}
              created={contribution.created}
              token={this.props.token}
              type="contributions"
              canEdit={contribution.canEdit || false}
              onDeleted={() => {
                this.setState({ showAddContributions: true })
                this.refreshContributions()
              }}
              onCreated={() => {
                this.setState({ showAddContributions: true })
                this.refreshContributions()
              }}
            />
          )
        })}
      </React.Fragment>
    )

    return (
      <div>
        <p>
          Hello <b>{this.props.delegate.name}</b>! This is where you can edit all your information.
          <span style={{ textAlign: 'right', float: 'right', cursor: 'pointer' }} onClick={logout}>
            Logout
          </span>
        </p>
        <hr />

        <h3>Payout information</h3>
        <PayoutsForm onSubmit={this.handlePayoutSubmit}>
          <PayoutsContainer>
            <PayoutGroup>
              <Label>Private delegate?</Label>
              <input
                type="checkbox"
                name="isPrivate"
                checked={this.state.isPrivate}
                onChange={this.handleChange}
              />
              {this.state.errorsPayout.payout_percent ? (
                <ErrorMsg>{this.state.errorsPayout.payout_percent}</ErrorMsg>
              ) : null}
            </PayoutGroup>
            <PayoutGroup>
              <Label>Payout %</Label>
              <input
                type="number"
                name="payoutPercent"
                max="100"
                min="0"
                value={this.state.payoutPercent}
                onChange={this.handleChange}
              />
              {this.state.errorsPayout.payout_percent ? (
                <ErrorMsg>{this.state.errorsPayout.payout_percent}</ErrorMsg>
              ) : null}
            </PayoutGroup>

            <PayoutGroup>
              <Label>Payout min amount</Label>
              <input
                type="number"
                name="payoutMin"
                value={this.state.payoutMin}
                onChange={this.handleChange}
              />
              {this.state.errorsPayout.payout_minimum ? (
                <ErrorMsg>{this.state.errorsPayout.payout_minimum}</ErrorMsg>
              ) : null}
            </PayoutGroup>

            <PayoutGroup>
              <Label>Payout max amount</Label>
              <input
                type="number"
                name="payoutMax"
                value={this.state.payoutMax}
                onChange={this.handleChange}
              />
              {this.state.errorsPayout.payout_maximum ? (
                <ErrorMsg>{this.state.errorsPayout.payout_maximum}</ErrorMsg>
              ) : null}
            </PayoutGroup>

            <PayoutGroup>
              <Label>Payout interval (in hours)</Label>
              <input
                type="number"
                name="payoutInterval"
                value={this.state.payoutInterval}
                onChange={this.handleChange}
              />
              {this.state.errorsPayout.payout_maximum ? (
                <ErrorMsg>{this.state.errorsPayout.payout_interval}</ErrorMsg>
              ) : null}
            </PayoutGroup>
          </PayoutsContainer>

          <button type="submit">Save payout info</button>
        </PayoutsForm>

        <hr />

        <TabContainer>
          <TabElement
            isSelected={this.state.selectedTab === 'proposal'}
            onClick={() => this.setState({ selectedTab: 'proposal' })}
          >
            Proposal
          </TabElement>
          <TabElement
            isSelected={this.state.selectedTab === 'news'}
            onClick={() => this.setState({ selectedTab: 'news' })}
          >
            News
          </TabElement>
          <TabElement
            isSelected={this.state.selectedTab === 'contributions'}
            onClick={() => this.setState({ selectedTab: 'contributions' })}
          >
            Contributions
          </TabElement>
        </TabContainer>

        {this.state.selectedTab === 'proposal' ? proposalEl : null}
        {this.state.selectedTab === 'news' ? newsEl : null}
        {this.state.selectedTab === 'contributions' ? contributionsEl : null}
      </div>
    )
  }
}

export default withAuthSync(EditDelegate)
