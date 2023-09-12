import { Box, VStack, Flex, Link, Icon, Button, Input, IconButton, useDisclosure } from '@chakra-ui/react';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { HiFolderOpen, HiBriefcase, HiCog, HiOutlineHome, HiMenu, HiOutlineInformationCircle } from 'react-icons/hi';
import { colord } from "colord";
import NextLink from 'next/link';
import { useRef, useState, useEffect } from 'react';
import UserSessionMenu from '@/components/userSessionMenu.js';


export default function SideNavbar({accountId, type}) {
    const [userInfo, setUserInfo] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef();

    let primaryColor = '#512B81';
    let primaryDarker = '#1D0C33';

    const links = [
        { id: 1, name: 'Home', href: '/', icon: HiOutlineHome, allowed: ['user', 'admin'] },
        { id: 2, name: 'Account', href: `/account/${accountId}?type=${type}`, icon: HiOutlineInformationCircle, allowed: ['user', 'admin'] },
        { id: 3, name: 'Agreements', href: `/agreements?acc=${accountId}&type=${type}`, icon: HiFolderOpen, allowed: ['user', 'admin'] },
        { id: 4, name: 'Submissions', href: `/submissions?acc=${accountId}&type=${type}`, icon: HiBriefcase, allowed: ['user', 'admin'] },
        { id: 5, name: 'Admin', href: '/admin', icon: HiBriefcase, allowed: ['admin'] },
    ]

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserInfo(user);
    }, []);

    return (
        <>
            <Box bg={'#1D0C33'} display={{base: 'none', lg: 'flex'}} direction={'column'} justifyContent={'center'} ml={7} p={4} w={'200px'} h={'90vh'} rounded={25} border={'2px solid #512B81'}>
                <Flex direction={'column'} wrap={'wrap'} justifyContent={'space-between'} h={'100%'} fontSize={'1.2em'} color={'white'} >
                <VStack gap={5} my={10} alignItems={'flex-start'}>
                    {links.map((link) => (
                           link.allowed.includes(userInfo?.role) &&
                           <LinkComponent key={link.id} link={link} />
                        )
                    )}
                </VStack>

                <Link as={NextLink} href='#' mb={10} display={'flex'} alignItems={'center'} _hover={{bg: primaryColor}} w={'100%'} p={3} rounded={20}>
                    <Icon as={HiCog} style={{ display: 'inline' }} mr={2} />
                    Settings
                </Link>
                </Flex>
            </Box>
            
            <Box display={{base: 'flex', lg: 'none'}}  justifyContent={'space-between'} mb={2}>
                <IconButton ref={btnRef} aria-label='Menu' icon={<HiMenu />} colorScheme={'purple'} w={'50px'} ml={2} onClick={onOpen} />
                <UserSessionMenu />
            </Box>
               
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}                           
            >
                <DrawerOverlay />
                <DrawerContent border={'2px solid #512B81'}>
                    <DrawerCloseButton color={'white'}/>

                    <DrawerBody bg={primaryDarker} fontSize={'1.2em'} color={'white'} >
                        <VStack gap={5} my={10} alignItems={'flex-start'}>
                            {links.map((link) => (
                                link.allowed.includes(userInfo?.role) &&
                                <LinkComponent key={link.id} link={link}/>
                                )
                            )}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

const LinkComponent = ({link}) => {
    let primaryColor = '#512B81';

    return (
        <Link as={NextLink} href={link.href} display={'flex'} alignItems={'center'} _hover={{bg: primaryColor}} w={'100%'} p={3} rounded={20}>
            <Icon as={link.icon} style={{ display: 'inline' }} mr={2} />
            {link.name} 
        </Link>
    )
}