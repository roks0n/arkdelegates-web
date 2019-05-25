import Link from 'next/link'
import { withRouter } from 'next/router'
import styled from '@emotion/styled'
import { COLOR_RED, COLOR_WHITE } from '../../constants'

const NavLink = styled.a`
  margin-left: 1em;
  margin-right: 0.5em;
  font-weight: 300;
  text-decoration: none;
  padding-top: 1.2em;
  padding-bottom: 1.2em;
  color: ${(props) => (props.isActive ? COLOR_RED : COLOR_WHITE)};
`

function ActiveLink({ children, router, href }) {
  return (
    <Link href={href} passHref>
      <NavLink isActive={router.asPath === href}>{children}</NavLink>
    </Link>
  )
}

export default withRouter(ActiveLink)
