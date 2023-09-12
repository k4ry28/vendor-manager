import Head from 'next/head';
import { useRouter } from 'next/router';
import { Red_Hat_Display  } from '@next/font/google';
import { Box } from '@chakra-ui/react';


const redHat = Red_Hat_Display({ subsets: ['latin'] });

export default function Layout ({ children }) {
    const router = useRouter();

    let bgColor = '#000119';

    const pathnameSplit = router.pathname.split('/');
    const titlePathname = pathnameSplit[pathnameSplit.length - 1].toUpperCase();

    return (
        <>
            <Head>
                <meta
                    name="description"
                    content='vendor-manager'
                />               
                <meta name="og:title" content={'Manager'} />
                <title>Vendor Manager App</title>
            </Head>
            <header>
               
            </header>
            <main className={redHat.className}>    
                { titlePathname == 'LOGIN' || titlePathname == 'SIGNUP'?
                    children
                    :
                    <Box bg={bgColor} display={'flex'}  flexDirection={{base: 'column', lg: 'row'}} flexWrap={{base: 'wrap', lg: 'wrap'}} alignItems={'center'} justifyContent={'center'} >                  
                        {children}                   
                    </Box>
                }                         
            </main>
        </>
    )
}