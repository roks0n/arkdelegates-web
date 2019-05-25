import { withRouter } from 'next/router'
import styled from '@emotion/styled'
import { COLOR_RED } from '../../constants'
import Nav from './Nav'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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

  > p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6:first-of-type {
    margin-top: 0;
  }
`

function Tabbed({ items, router }) {
  const path = router.asPath
  const currentItem = items.filter((item) => path === item.href)
  return (
    <Container>
      <Nav items={items} />
      <Content dangerouslySetInnerHTML={{ __html: currentItem[0].content }} />
    </Container>
  )
}

export default withRouter(Tabbed)
