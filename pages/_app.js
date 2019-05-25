import App, { Container } from 'next/app'
import { css, Global } from '@emotion/core'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageContainer from '../components/PageContainer'
import { COLOR_BLACK, COLOR_LIGHT_BLUE } from '../constants'

import 'normalize.css'

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
      <Container>
        <Global
          styles={css`
            @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

            html,
            body {
              font-family: 'Roboto', sans-serif;
              background-color: ${COLOR_LIGHT_BLUE};
              font-weight: 400;
              color: ${COLOR_BLACK};
            }

            body {
              font-size: 0.95rem;
            }

            div {
              box-sizing: border-box;
            }
          `}
        />
        <Header />
        <PageContainer>
          <Component {...pageProps} />
        </PageContainer>
        <Footer />
      </Container>
    )
  }
}

export default Arkdelegates
