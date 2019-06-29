import styled from '@emotion/styled'
import Head from 'next/head'
import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import { login } from '../modules/auth'
import { COLOR_BLACK, API_URL } from '../constants'
import { Router } from '../routes'

const Title = styled.h1`
  color: ${COLOR_BLACK};
  text-align center;
`
const Container = styled.div`
  max-width: 600px;
  width: 100%;
  margin: auto;
`

const Form = styled.form`
  width: 360px;
  margin: 1em auto 0;

  label {
    text-align: left;
    display: block;
    width: 100%;
    margin-bottom: 0.25em;
  }

  input[type='text'] {
    width: 100%;
    display: block;
    margin-bottom: 1em;
    padding: 0.7em;
    border: 1px solid #cacaca;
  }

  input[type='submit'],
  button[type='submit'] {
    float: right;
    padding: 0.7em 0.7em 0.75em;
  }
`

const ErrorMsg = styled.div`
  text-align: left;
  position: relative;
  top: -12px;
  background: #cc3300;
  padding: 5px;
  color: white;
  font-size: 0.85em;
`

const GeneralErrorMsg = styled.div`
  text-align: left;
  position: relative;
  background: #cc3300;
  margin: 0em 0 1em 0;
  padding: 5px;
  color: white;
  font-size: 0.85em;
`

class ClaimDelegate extends Component {
  constructor(props) {
    super(props)
    this.state = { email: '', password: '', errors: {} }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  async handleSubmit(event) {
    event.preventDefault()
    this.setState({ error: '' })
    const delegate = this.state.delegate

    const url = `${API_URL}delegates/${delegate}/`

    try {
      const [data, status] = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).then(async (res) => [await res.json(), res.status])

      if (status === 200) {
        if (data.user_id) {
          this.setState({
            'errors': {delegate : `${data.slug} delegate's account is already claimed`}
          })
        } else {
          Router.pushRoute('claim-delegate-account', {slug: data.slug})
        }
      } else if (status === 404) {
        this.setState({
          'errors': {delegate : `${this.state.delegate} delegate account does not exist`}
        })
      } else {
        console.log('error')
        this.setState({ errors: data })
      }
    } catch (error) {
      console.error('You have an error in your code or there are Network issues.', error)
    }
  }

  render() {
    let nonFieldErrors = null
    if (this.state.errors.non_field_errors) {
      nonFieldErrors = this.state.errors.non_field_errors.join(', ')
    }

    return (
      <Container>
        <Head>
          <title>Claim a delegate account @ ARKdelegates.io</title>
          <meta
            name="description"
            content="Claim a delegate account and seize full control over what data that is shown
            on ARKdelegates"
          />
        </Head>
        <Title>Claim a delegate account</Title>
        <p>
          Owner of a delegate can claim his account and seize full control over what data that is
          shown on the website. Ownership of an account is proven by signing a provided pin
          code.
        </p>
        <p>
          If you wish to claim a delegate account search for it and follow the steps!
        </p>

        <hr />

        <Form onSubmit={this.handleSubmit}>
          <label>Which delegate account would you like to claim?</label>
          <input
            type="text"
            name="delegate"
            value={this.state.delegate}
            onChange={this.handleChange}
            placeholder="Type a delegate name"
          />
          {this.state.errors.delegate ? <ErrorMsg>{this.state.errors.delegate}</ErrorMsg> : null}

          {nonFieldErrors ? <GeneralErrorMsg>{nonFieldErrors}</GeneralErrorMsg> : null}

          <button type="submit">
            Claim account
          </button>
        </Form>
      </Container>
    )
  }
}

export default ClaimDelegate
