import { Link } from '../../routes'
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

function ActiveLink({ children, router, routeName, slug, href }) {
  return (
    <Link route={routeName} params={{ slug }} passHref>
      <NavLink isActive={router.asPath === href}>{children}</NavLink>
    </Link>
  )
}

export default withRouter(ActiveLink)
