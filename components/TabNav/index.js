import styled from '@emotion/styled'
import { COLOR_BLACK, COLOR_WHITE } from '../../constants'
import ActiveLink from './ActiveLink'

const Container = styled.div`
  width: 100%;
  display: flex;
  background-color: ${COLOR_BLACK};
  color: ${COLOR_WHITE};
  border-radius: 5px 5px 0 0;
  list-style: none;
  padding: 0;
  margin: 0;
`

function TabNav({ items }) {
  const links = items.map((item, key) => {
    return (
      <ActiveLink key={key} routeName={item.routeName} slug={item.slug} href={item.href}>
        {item.name}
      </ActiveLink>
    )
  })
  return <Container>{links}</Container>
}

export default TabNav
