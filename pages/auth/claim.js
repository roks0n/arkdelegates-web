import styled from '@emotion/styled'
import React from 'react'
import Error from 'next/error'
import { API_URL } from '../../constants'
import fetch from 'isomorphic-unfetch'
import { login } from '../../modules/auth'

const Title = styled.h1`
  color: #cc3300;
`
const Container = styled.div`
  text-align: center;
`
const PinContainer = styled.div`
  padding: 0.7em;
  width: 220px;
  margin: auto;
  background: #fff;
  border: 1px solid #cacaca;
  text-align: center;
  margin-bottom: 0.7em;
`
const PinTitle = styled.h3`
  margin: 0 0 0.5em 0;
  padding: 0;
  font-weight: 400;
`
const Guide = styled.div`
  ul {
    margin: 2em 0;
    list-style: none;
  }

  li {
    margin-bottom: 0.4em;
  }
`

const Form = styled.form`
  width: 320px;
  margin: auto;

  label {
    text-align: left;
    display: block;
    width: 100%;
    margin-bottom: 0.25em;
  }

  input[type='email'],
  input[type='password'],
  textarea {
    width: 100%;
    display: block;
    margin-bottom: 1em;
    padding: 0.5em;
    border: 1px solid #cacaca;
  }

  input[type='submit'] {
    float: right;
    padding: 0.5em 0.5em 0.45em;
  }
`

const ErrorMsg = styled.div`
  text-align: left;
  position: relative;
  top: -16px;
  background: #cc3300;
  padding: 5px;
  color: white;
  font-size: 0.85em;
`

// const ENDPOINT = 'https://arkdelegates.io/api/auth/claim-delegate'
const ENDPOINT = `${API_URL}auth/claim-delegate`

class ClaimDelegate extends React.Component {
  state = {
    message: '',
    email: '',
    password: '',
    errors: {},
  }

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  static async getInitialProps({ ctx }) {
    const { query, res } = ctx

    if (!query.slug) {
      if (res) {
        res.statusCode = 404
      }
      return {}
    }

    const data = await fetch(`${ENDPOINT}/${query.slug}/`).then((res) => res.json())
    return { ...data, slug: query.slug }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  async onFormSubmit(e) {
    e.preventDefault()

    const data = {
      message_json: this.state.message,
      email: this.state.email,
      password: this.state.password,
    }
    const [response, status] = await fetch(`${ENDPOINT}/${this.props.slug}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(async (res) => [await res.json(), res.status])

    if (status == 400 && response.errors) {
      this.setState({ errors: response.errors })
      return
    }

    if (status == 200 && response.token) {
      login({ token: response.token, username: response.user.username })
    }
  }

  render() {
    if (!Object.values(this.props).length) return <Error statusCode={404} />

    // potential errors when page rendered on the backend (GET request to API)
    if (Object.values(this.props.errors || {}).length) return <Error statusCode={400} />

    // this error is raised if account has already been claimed after form submission
    if (Object.values(this.state.errors.__all__ || {}).length) return <Error statusCode={400} />

    return (
      <Container>
        <Title>Claim {this.props.slug} delegate</Title>
        <PinContainer>
          <PinTitle>Pin code:</PinTitle>
          {this.props.pin}
        </PinContainer>

        <Guide>
          <ul>
            <li>1. Copy the above pin code and sign it in your delegate's wallet.</li>
            <li>2. After it's signed, copy the whole JSON by clicking on the blue icon.</li>
            <li>3. Paste the copied JSON into the "Message json:" field.</li>
          </ul>
          <p>
            Please note that the <b>PIN code expires after 3 minutes</b>.
          </p>
        </Guide>

        <Form>
          <label style={this.state.errors.message_json ? { color: '#cc3300' } : {}}>
            Message JSON:
          </label>
          <textarea
            cols="40"
            rows="2"
            name="message"
            value={this.state.message}
            onChange={this.handleChange}
            style={this.state.errors.message_json ? { borderColor: '#cc3300' } : {}}
          />
          {this.state.errors.message_json ? (
            <ErrorMsg>{this.state.errors.message_json}</ErrorMsg>
          ) : null}

          <label style={this.state.errors.email ? { color: '#cc3300' } : {}}>Email:</label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
            style={this.state.errors.email ? { borderColor: '#cc3300' } : {}}
          />
          {this.state.errors.email ? <ErrorMsg>{this.state.errors.email}</ErrorMsg> : null}

          <label style={this.state.errors.password ? { color: '#cc3300' } : {}}>Password:</label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            style={this.state.errors.password ? { borderColor: '#cc3300' } : {}}
          />
          {this.state.errors.password ? <ErrorMsg>{this.state.errors.password}</ErrorMsg> : null}

          <input
            type="submit"
            value="Claim account"
            onClick={async (e) => await this.onFormSubmit(e)}
          />
        </Form>
      </Container>
    )
  }
}

export default ClaimDelegate
