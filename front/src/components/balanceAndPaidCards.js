import { Box, Text } from '@chakra-ui/react';
import useSWR from 'swr';
import fetcher from '@/utils/fetcher';

const BalanceAndPaidCards = ({balance, unpaid_submissions}) => {
    
    return (
        <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'center'} alignContent={'center'} gap={10} w={{base: '100%', lg: '40%'}}>
            <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} justifyContent={'center'} alignContent={'center'} bg={'#512B81'} color={'white'} rounded={25} p={4} w={'40%'}>
                <Text fontWeight={'semibold'} textAlign={'center'}> BALANCE </Text>
                <Text fontSize={'1.5em'} fontWeight={'semibold'}> {`$${balance.toFixed(2)}`} </Text>
            </Box>
            <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} justifyContent={'center'} alignContent={'center'} bg={'#512B81'} color={'white'} rounded={25} p={4} w={'40%'}>
                <Text fontWeight={'semibold'} textAlign={'center'}> UNPAID </Text>
                <Text fontSize={'1.5em'} fontWeight={'semibold'}> {`$${unpaid_submissions.toFixed(2)}`} </Text>
            </Box>
        </Box>
    )
}

export default BalanceAndPaidCards;