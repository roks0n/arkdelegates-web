import styled from '@emotion/styled'
import ActiveLink from './ActiveLink'

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`

function HeaderNavigation() {
  return (
    <Container>
      <ActiveLink href="/">Home</ActiveLink>
      <ActiveLink href="/contributions">Contributions</ActiveLink>
      <ActiveLink href="/news">News</ActiveLink>
      <ActiveLink href="/delegates">Delegates</ActiveLink>
    </Container>
  )
}

export default HeaderNavigation
