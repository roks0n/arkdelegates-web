import styled from '@emotion/styled'
import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import { login } from '../../modules/auth'
import { COLOR_BLACK, API_URL } from '../../constants'

const Title = styled.h1`
  color: ${COLOR_BLACK};
`
const Container = styled.div`
  text-align: center;
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
  input[name='email'],
  input[type='password'],
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

const ErrorMsg = styled.div`
  text-align: left;
  position: relative;
  top: -16px;
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

class Login extends Component {
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
    const email = this.state.email
    const password = this.state.password

    const url = `${API_URL}auth/login/`

    try {
      const [data, status] = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then(async (res) => [await res.json(), res.status])

      if (status === 200 && data.token) {
        login({ token: data.token, username: data.user.username })
      } else {
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
        <Title>Login</Title>

        <Form onSubmit={this.handleSubmit}>
          <label>Email</label>
          <input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
          {this.state.errors.email ? <ErrorMsg>{this.state.errors.email}</ErrorMsg> : null}

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          {this.state.errors.password ? <ErrorMsg>{this.state.errors.password}</ErrorMsg> : null}

          {nonFieldErrors ? <GeneralErrorMsg>{nonFieldErrors}</GeneralErrorMsg> : null}

          <button type="submit" value="Login">
            Login
          </button>
        </Form>
      </Container>
    )
  }
}

export default Login
