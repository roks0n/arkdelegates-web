import styled from '@emotion/styled'
import { Link } from '../routes'
import logo from './ark-logo-light-bg.svg'
import { COLOR_LIGHT_BLUE, COLOR_BLACK } from '../constants'

const Container = styled.a`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${COLOR_LIGHT_BLUE};
  padding-bottom: 0.5em;
  padding-top: 0.5em;
  font-size: 0.9em;
  cursor: pointer;
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

const Image = styled.div`
  width: 60px;
  height: 60px;
  border: 1px solid ${COLOR_LIGHT_BLUE};
  margin-right: 0.5em;
  border-radius: 4px;
  background-size: 100%;
  background-position: center center;
  background-color: #fbfbfb;
  background-repeat: no-repeat;
  flex-shrink: 0;

  ${({ image }) => `background-image: url(${image ? image : logo});`}
  ${({ image }) => !image && `background-size: 80%;`}

  @media only screen and (max-width: 544px) {
    width: 40px;
    height: 40px;
  }
`

const Span = styled.span`
  color: #9ea0a5;
  font-size: 0.8em;
  display: block;
`

const P = styled.p`
  margin: 0;
  padding: 0;
  flex-shrink: 1;
  width: 100%;
`

function ContributionCard({ avatar, slug, title, delegate }) {
  return (
    <Link route={'delegate-news'} params={{ slug }} passHref>
      <Container>
        <Image image={avatar} />
        <P>
          {title} <Span>by {delegate}</Span>
        </P>
      </Container>
    </Link>
  )
}

export default ContributionCard
