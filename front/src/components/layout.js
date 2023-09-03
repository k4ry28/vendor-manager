import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Red_Hat_Display  } from '@next/font/google';
import SideNavbar from '@/components/sideNavbar.js';
import { Box } from '@chakra-ui/react';
import dayjs from 'dayjs';


const redHat = Red_Hat_Display({ subsets: ['latin'] });

export default function Layout ({ children }) {
    const router = useRouter();

    let primaryColor = '#000119';

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
                {
                    titlePathname === 'LOGIN' ?
                        children
                    :
                    <Box bg={primaryColor} h={'100vh'} display={'flex'} flexDirection={{base: 'column', lg: 'row'}} flexWrap={{base: 'wrap', lg: 'wrap'}} alignContent={'center'} justifyContent={{base: 'center', lg: 'center'}} > 
                        { titlePathname !== '' &&
                            <SideNavbar />
                        }                
                        {children}                   
                    </Box>
                }                          
            </main>
        </>
    )
}