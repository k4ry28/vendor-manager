import { Box, Text, Flex, Icon, IconButton, Badge } from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { HiMenu, HiOutlineUser, HiOutlineInformationCircle, HiOutlineDocumentText } from 'react-icons/hi';
import { BsCalendarDate } from 'react-icons/bs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import UserSessionMenu from '@/components/userSessionMenu.js';
import SideNavbar from '@/components/sideNavbar.js';


const AgreementsView = ({acc, type}) => {
    const [agreements, setAgreements] = useState(null);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    let bgColor = '#000119';
    let primaryColor = '#512B81';
    let primaryDarker = '#1D0C33';

    const { data } = useSWR(`/api/agreements/getAgreements?account_id=${acc}`, fetcher);
        
    useEffect(() => {
        if(data && !data.error){
            setAgreements(data);
            setError(null);
        }
        else if(data && data.error){
            setError(data.error);
            setAgreements(null);
        }
        
    }, [data]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserInfo(user);
    }, []);
    
    return (
        <Box bg={bgColor} h={'100vh'} w={'100%'} display={'flex'} flexDirection={{base: 'column', lg: 'row'}} flexWrap={'wrap'} alignContent={'center'} justifyContent={{base: 'center', lg: 'center'}} > 
            <SideNavbar accountId={acc} type={type} />

            <Box h={'90vh'} w={{base: '100%', lg: '75%', xl: '80%'}} display={'flex'} flexDirection={'column'} alignItems={'center'} mx={'auto'} gap={10} >
                <Flex w={'100%'} alignItems={'center'} justifyContent={'flex-end'}>
                    <Box display={{base: 'none', lg: 'flex'}}>
                        <UserSessionMenu />
                    </Box>
                </Flex>
                { agreements &&                    
                    <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} alignContent={'center'} gap={10} w={{base: '95%', lg: '80%'}} h={'100%'} bg={primaryDarker} rounded={25} border={'2px solid #512B81'}>
                        <Text fontSize={{base: 'xl', lg: '3xl'}} fontWeight={'semibold'} mt={5} color={'white'} alignSelf={'center'}> Active Agreements </Text>
                        { agreements.length > 0 ?
                            agreements.map(agreement => (
                                <AgreementCard key={agreement.id} agreement={agreement} user={userInfo} />
                            ))
                            :
                            <Text mt={5} color={'white'} alignSelf={'center'}> No active agreements yet... </Text>
                        }
                    </Box>
                   
                }
                { error &&
                    <Box textAlign={'center'} bg={primaryDarker} color={'white'} p={4} rounded={25} fontSize={'2xl'} border={'2px solid #512B81'}>
                        <Text color={'white'} mb={5}> {error} </Text>
                        <Image src={'/images/404.jpg'} alt="error" width={400} height={400}/>
                    </Box>
                }
            </Box>
        </Box>
    )
}

const AgreementCard = ({agreement, user}) => {
    let primaryColor = '#512B81';
    let primaryDarker = '#1D0C33';
    let secondaryColor = '#4477CE';

    return (
        <Box display={'flex'} flexDirection={'row'} w={{base: '90%', lg: '60%'}} justifyContent={'center'} bg={primaryColor} color={'white'} rounded={25} p={4} >
            <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} justifyContent={'center'} alignContent={'center'} gap={2}  w={'100%'} fontSize={{base: 16, lg: 18}}>
                <Box display={'flex'} flexDirection={'row'} gap={10}>
                    <Text><Icon as={HiOutlineUser} mr={2}/><strong>Buyer:</strong> {`${agreement.Buyer.firstName} ${agreement.Buyer.lastName}`} </Text>
                    <Text><Icon as={HiOutlineUser} mr={2}/><strong>Supplier:</strong> {`${agreement.Supplier.firstName} ${agreement.Supplier.lastName}`} </Text>
                </Box>
                <Text><Icon as={HiOutlineInformationCircle} mr={2}/><strong>Status:</strong> <Badge colorScheme={'blue'}>{agreement.status.split('_').join(' ').toUpperCase()}</Badge> </Text>
                <Text><Icon as={BsCalendarDate} mr={2}/><strong>Date:</strong> {dayjs(agreement.createdAt).format('DD/MM/YYYY')} </Text>
                <Text><Icon as={HiOutlineDocumentText} mr={2}/><strong>Terms:</strong> {agreement.terms} </Text>
            </Box>
            <Box w={'10%'}>
                <Menu>
                    <MenuButton 
                        as={IconButton}
                        colorScheme={'blue'}
                        aria-label='Options'
                        cursor={'pointer'}
                        icon={<HiMenu />}
                        color={'white'}
                    >
                        
                    </MenuButton>
                    <MenuList bg={primaryDarker}>               
                        { agreement.Buyer.id === user.id &&
                            <MenuItem bg={primaryDarker} textAlign={'center'} _hover={{bg: secondaryColor}} color={'white'} >Edit</MenuItem>
                        }
                        <MenuItem bg={primaryDarker} textAlign={'center'} _hover={{bg: secondaryColor}} color={'white'} >See Submissions</MenuItem>
                    </MenuList>
                </Menu>
            </Box>
        </Box>
    )
}

AgreementsView.getInitialProps = async ({ query }) => {
    const {acc, type} = query;
    return {acc, type};
}



export default AgreementsView;