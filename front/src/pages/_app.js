import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../components/layout';
import '../styles/styles.css';
import theme from '../styles/chakra-global.js';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
    </ChakraProvider >
  )
}
