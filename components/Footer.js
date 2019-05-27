import styled from '@emotion/styled'
import { COLOR_BLACK, COLOR_WHITE } from '../constants'

const Container = styled.div`
  width: 100%;
  background: ${COLOR_BLACK};
  display: table;
  align-items: center;
  margin-top: 2em;
  flex-shrink: 0;
`

const Inner = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: auto;
  padding-left: 0.5em;
  padding-right: 0.5em;
`

const P = styled.p`
  font-size: 0.8em;
  font-weight: 300;
  color: ${COLOR_WHITE};
  text-align: right;
`

const A = styled.a`
  color: ${COLOR_WHITE};
  text-decoration: none;
`

function Footer() {
  return (
    <Container>
      <Inner>
        <P>
          Delegate Login |{' '}
          <A href="https://github.com/deadlock-delegate/arkdelegates-web/" target="_blank">
            Github
          </A>{' '}
          | v0.9.0
        </P>
      </Inner>
    </Container>
  )
}

export default Footer
