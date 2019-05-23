import styled from '@emotion/styled'
import Link from 'next/link';
import logo from './ark-logo.svg'
import HeaderNavigation from '../HeaderNavigation'
import PageContainer from '../PageContainer'
import { COLOR_BLACK } from '../../constants'

const Container = styled.div`
  width: 100%;
  background: ${COLOR_BLACK};
  display: table;
  align-items: center;
`

const Inner = styled(PageContainer)`
  display: flex;
  align-items: center;

  @media only screen and (max-width: 544px) {
    flex-direction: column;
  }
`

const Title = styled.span`
  color: white;
  font-weight: 300;
  margin: 0 0 0 0.5em;
  padding: 0;
  font-size: 1.2em;
  font-weight: normal;
`

const LeftContainer = styled.div`
  margin-left: auto;

  @media only screen and (max-width: 544px) {
    margin-left: unset;
  }
`

const LogoLink = styled.a`
  text-decoration: none;
  display: flex;
  align-items: center;
  @media only screen and (max-width: 544px) {
    margin-top: 0.5em
  }
`

function Header() {
  return (
    <Container>
      <Inner>
        <Link href="/" passHref>
          <LogoLink>
            <img src={logo} width={50} />
            <Title>ARKdelegates.io</Title>
          </LogoLink>
        </Link>

        <LeftContainer>
          <HeaderNavigation />
        </LeftContainer>
      </Inner>
    </Container>
  )
}

export default Header
