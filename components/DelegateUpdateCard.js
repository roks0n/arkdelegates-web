import styled from '@emotion/styled'
import { COLOR_BLACK, COLOR_LIGHT_BLUE, COLOR_RED } from '../constants'
import showdown from 'showdown'
import moment from 'moment'

const Container = styled.div`
  align-items: center;
  border-bottom: 1px solid ${COLOR_LIGHT_BLUE};
  padding-bottom: 1em;
  padding-top: 1em;
  font-size: 0.9em;
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

const H3 = styled.h3`
  font-weight: 500;
  margin: 0 0 0.5em 0;
`

const Created = styled.div`
  color: #9ea0a5;
  font-size: 0.9em;
  display: block;
`

const MarkdownContent = styled.div`
  a {
    text-decoration: none;
    color: ${COLOR_RED};
  }

  > p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6:first-of-type {
    margin-top: 0.5em;
  }

  > p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6:last-of-type {
    margin-bottom: 0;
  }
`

function DelegateUpdateCard({ title, content, created }) {
  const markdown = new showdown.Converter()
  const contentHtml = markdown.makeHtml(content)
  return (
    <Container>
      <H3>{title}</H3>
      <Created>Created on: {moment(created).format('LL')}</Created>
      <MarkdownContent dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </Container>
  )
}

export default DelegateUpdateCard
