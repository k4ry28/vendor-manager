import { Box, Text, Flex, Icon, Button, Input, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdOutlinePostAdd, MdOutlineAddToPhotos, MdOutlineAttachMoney, MdOutlineVerticalAlignBottom, MdAddTask } from 'react-icons/md';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';
import UserSessionMenu from '@/components/userSessionMenu.js';
import BalanceAndPaidCards from '@/components/balanceAndPaidCards.js';
import TitleGradientStroke from '@/components/titleGradientStroke.js';


const AccountView = ({id, type}) => {
    const [accountInfo, setAccountInfo] = useState(null);

    const { data, error } = useSWR(`/api/account/getAccountInfoById?account_id=${id}`, fetcher);

    const shortcuts = [
        { id: 1, name: 'Pay Submission', icon: MdOutlineAttachMoney, type: 'buyer' },
        { id: 2, name: 'Deposit', icon: MdOutlineVerticalAlignBottom, type: 'buyer' },
        { id: 3, name: 'Create Agreement', icon:MdOutlinePostAdd, type: 'buyer' },
        { id: 4, name: 'Create Submission', icon: MdAddTask, type: 'supplier' }
    ]
    
    useEffect(() => {
        if(data){
            console.log(data);
            setAccountInfo(data);
        }
    }, [data]);
    
    return (
        <Box h={'90vh'} w={{base: '100%', lg: '75%', xl: '80%'}} display={'flex'} flexDirection={'column'} alignItems={'center'} mx={'auto'} gap={10} >
            <Flex w={'100%'} alignItems={'center'} justifyContent={{base: 'center', lg: 'space-between'}}>
                { accountInfo ?
                    <BalanceAndPaidCards balance={accountInfo?.account?.balance} unpaid_submissions={accountInfo?.unpaid_submissions} />
                    :
                    <Box></Box>
                }
                <Box display={{base: 'none', lg: 'flex'}}>
                    <UserSessionMenu />
                </Box>
            </Flex>
            <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} alignContent={'center'} gap={10} w={'100%'} >
                <TitleGradientStroke title={`Hi ${accountInfo?.account?.firstName}!`}/>
                <Text fontSize={{base: 'lg', lg: '2xl'}} color={'white'} alignSelf={'center'}> Here are some shortcuts for you... </Text>
                
                { shortcuts.map((shortcut) => (
                    shortcut.type === type && <Shortcut key={shortcut.id} item={shortcut} />
                ))
                }
            </Box>
        </Box>
    )
}

const Shortcut = ({item}) => {
    return (
        <Box as={'button'} display={'flex'} flexDirection={'column'} flexWrap={'wrap'} alignSelf={'center'} justifyContent={'center'} alignContent={'center'} bg={'#512B81'} color={'white'} rounded={25} p={4} w={{base: '40%', lg: '30%'}}>
            <Icon as={item.icon} boxSize={12} bg={'white'} color={'#0099ff'} p={2} rounded={100} mx={'auto'} mb={2} />
            <Text fontWeight={'semibold'} textAlign={'center'}> {item.name} </Text>
        </Box>
    )
}

AccountView.getInitialProps = async ({ query }) => {
    const {id, type} = query;
    return {id, type};
}

export default AccountView;