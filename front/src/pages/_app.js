import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../components/layout';
import '../styles/styles.css';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
    </ChakraProvider >
  )
}
