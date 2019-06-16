import React from 'react'
import fetch from 'isomorphic-unfetch'
import styled from '@emotion/styled'
import { COLOR_BLACK, API_URL } from '../constants'

const Container = styled.div`
  position: relative;
  align-items: center;
  border: 1px solid #cccccc;
  padding: 0.5em;
  text-decoration: none;
  color: ${COLOR_BLACK};
  margin-bottom: 0.5em;
`

const Title = styled.h4`
  width: 90%;
  margin: 0 0 0.5em 0;
`

const P = styled.p`
  margin: 0 0 0.7em 0;
  padding: 0;
  width: 90%;
`

const DateTime = styled.p`
  margin: 0;
  padding: 0;
  width: 90%;
  color: #9ea0a5;
  font-size: 0.8em;
`

const ActionIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`

const DeleteIcon = styled.div`
  position: absolute;
  top: 50px;
  right: 10px;
  cursor: pointer;
`

const TitleInput = styled.input`
  width: 90%;
  margin: 0 0 0.5em 0;
  padding: 0.25em;
`

const DescriptionInput = styled.textarea`
  width: 90%;
  margin: 0 0 0.7em 0;
  padding: 0.25em;
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

class EditItem extends React.Component {
  state = {
    id: null,
    title: null,
    description: null,
    created: null,
    canEdit: false,
    errors: {},
    deleted: false,
  }

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    const { id, title, description, created, canEdit } = this.props
    this.setState({
      id,
      title,
      description,
      canEdit,
      created,
    })
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  async onSave() {
    this.setState({ errors: {} })

    let method = 'POST'
    let endpoint = `${API_URL}${this.props.type}/`
    if (this.state.id) {
      method = 'PUT'
      endpoint = `${API_URL}${this.props.type}/${this.state.id}/`
    }

    let requestData = {}
    if (this.props.type === 'news') {
      requestData = {
        title: this.state.title,
        message: this.state.description,
      }
    } else if (this.props.type === 'contributions') {
      requestData = {
        title: this.state.title,
        description: this.state.description,
      }
    }

    try {
      const [data, response] = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.props.token}`,
        },
        body: JSON.stringify(requestData),
      }).then(async (res) => [await res.json(), res])

      if (response.status === 201 || response.status === 200) {
        this.props.onCreated()
        alert('Done')
      } else if (response.status >= 400) {
        this.setState({ errors: data })
        return
      }
    } catch (error) {
      console.log(error)
      alert('There was an error')
      return
    }

    await this.setState({ canEdit: false })
  }

  async onDelete() {
    try {
      const response = await fetch(`${API_URL}${this.props.type}/${this.state.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${this.props.token}`,
        },
      }).then(async (res) => res)

      if (response.status === 200) {
        await this.props.onDeleted()
        alert('Deleted successfully')
      }
    } catch (error) {
      console.log(error)
      alert('There was an error deleting')
      return
    }
  }

  render() {
    let titleEl = <Title>{this.state.title || 'No title set'}</Title>
    let descriptionEl = <P>{this.state.description}</P>
    if (this.state.canEdit) {
      titleEl = (
        <TitleInput
          type="text"
          name="title"
          max="256"
          value={this.state.title}
          onChange={this.handleChange}
        />
      )
      descriptionEl = (
        <DescriptionInput
          name="description"
          value={this.state.description}
          onChange={this.handleChange}
        />
      )
    }

    return (
      <Container>
        {titleEl}
        {this.state.errors.title ? (
          <GeneralErrorMsg>{this.state.errors.title}</GeneralErrorMsg>
        ) : null}
        {descriptionEl}
        {this.state.errors.description ? (
          <GeneralErrorMsg>{this.state.errors.description}</GeneralErrorMsg>
        ) : null}
        <DateTime>Published: {this.state.created}</DateTime>
        {!this.state.canEdit ? (
          <ActionIcon onClick={() => this.setState({ canEdit: true })}>✏️ Edit</ActionIcon>
        ) : null}
        {this.state.canEdit ? <ActionIcon onClick={() => this.onSave()}>💾 Save</ActionIcon> : null}
        {<DeleteIcon onClick={() => this.onDelete()}>🗑 Delete</DeleteIcon>}
      </Container>
    )
  }
}

export default EditItem
