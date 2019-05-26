import App from 'next/app'
import styled from '@emotion/styled'
import { css, Global } from '@emotion/core'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageContainer from '../components/PageContainer'
import { COLOR_BLACK, COLOR_LIGHT_BLUE } from '../constants'

import 'normalize.css'

const AppContainer = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

class Arkdelegates extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx })
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <AppContainer>
        <Global
          styles={css`
            @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

            html,
            body {
              font-family: 'Roboto', sans-serif;
              background-color: ${COLOR_LIGHT_BLUE};
              font-weight: 400;
              color: ${COLOR_BLACK};
              height: 100%;
              min-height: 100%;
            }

            body {
              font-size: 0.95rem;
            }

            div {
              box-sizing: border-box;
            }

            #__next {
              height: 100%;
              min-height: 100%;
            }
          `}
        />
        <Header />
        <PageContainer>
          <Component {...pageProps} />
        </PageContainer>
        <Footer />
      </AppContainer>
    )
  }
}

export default Arkdelegates
