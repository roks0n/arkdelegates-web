import Link from 'next/link'
import { withRouter } from 'next/router'
import styled from '@emotion/styled'
import { COLOR_RED, COLOR_WHITE } from '../../constants'

const NavLink = styled.a`
  margin-left: 2em;
  font-weight: 300;
  text-decoration: none;
  padding-top: 1.2em;
  padding-bottom: 1.2em;
  color: ${(props) => (props.isActive ? COLOR_RED : COLOR_WHITE)};
  font-weight: ${(props) => (props.isActive ? 400 : 300)};

  @media only screen and (max-width: 544px) {
    font-size: 1em;
    margin-left: 1em;
    padding-top: 0.8em;
    padding-bottom: 0.8em;

    &:first-of-type {
      margin-left: 0em;
    }
  }
`

function ActiveLink({ children, router, href }) {
  return (
    <Link href={href} passHref>
      <NavLink isActive={router.pathname === href}>{children}</NavLink>
    </Link>
  )
}

export default withRouter(ActiveLink)
