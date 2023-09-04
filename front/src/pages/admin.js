import { Box, Text, Flex, Input, Icon, IconButton, Badge, Button, useToast } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import UserSessionMenu from '@/components/userSessionMenu.js';


const AdminView = () => {
    let bgColor = '#000119';
    let primaryColor = '#512B81';
    let primaryDarker = '#1D0C33';
    
    return (
        <Box bg={bgColor} h={'100%'} w={'100%'} display={'flex'} flexDirection={{base: 'column', lg: 'row'}} flexWrap={'wrap'} alignContent={'center'} justifyContent={{base: 'center', lg: 'center'}} overflow={{base: 'scroll', lg: 'auto'}}>
            <Box h={'90%'} w={{base: '100%', lg: '75%', xl: '80%'}} display={'flex'} flexDirection={'column'} alignItems={'center'} mx={'auto'} gap={10} >
                <Flex w={'100%'} alignItems={'center'} justifyContent={'flex-end'}>
                    <Box display={{base: 'none', lg: 'flex'}}>
                        <UserSessionMenu />
                    </Box>
                </Flex>
                <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} alignContent={'center'} gap={10} w={'80%'} h={'100%'} bg={primaryDarker} rounded={25}>
                    <Tabs isFitted variant='enclosed' w={'100%'} color={'white'}>
                        <TabList mb='1em'>
                            <Tab _selected={{ color: 'white', bg: primaryColor }}>Best Supplier</Tab>
                            <Tab _selected={{ color: 'white', bg: primaryColor }}>Best Buyers</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <BestSupplierTab />
                            </TabPanel>
                            <TabPanel>
                                <BestBuyersTab />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Box>
        </Box>
    )
}


const BestSupplierTab = () => {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [bestSupplier, setBestSupplier] = useState(null);
    const [error, setError] = useState(null);

    const toast = useToast();
    let primaryColor = '#512B81';

    const search = async () => {
        if (dateFrom && dateTo){
            await axios.get(`/api/admin/getBestSupplier?from=${dateFrom}&to=${dateTo}`)
            .then(function (response) {
                let best = response.data.length > 0 ? response.data : [];
                setBestSupplier(best);
                setError(null);
            })
            .catch(function (error) {
                let message = error.response?.data?.error ? error.response?.data?.error : error.response?.data?.message ? error.response?.data?.message : 'An error occurred';
                setError(message);
                setBestSupplier(null);
                toast({
                    title: 'Error',
                    description: message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                });
            })
        }
    }

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={5}>
            <Text fontSize={'xl'} mb={5}>Select two dates to search for best supplier profession in a period of time.</Text>
            <Flex direction={'row'} alignItems={'center'} wrap={'wrap'} w={'100%'} mb={5}>
                <Flex direction={'column'} alignContent={'center'} wrap={'wrap'} w={'50%'}>
                    <Text mb={2}>From</Text>
                    <Input type={'date'} w={{base: '98%', lg: '60%'}} onChange={(e) => setDateFrom(e.target.value)}/>
                </Flex>
                <Flex direction={'column'} alignContent={'center'} wrap={'wrap'} w={'50%'}>
                    <Text mb={2}>To</Text>
                    <Input type={'date'} w={{base: '98%', lg: '60%'}} onChange={(e) => setDateTo(e.target.value)}/>
                </Flex>
            </Flex>
            
            <Button w={'30%'} colorScheme={'purple'} onClick={search}>Search</Button>

            { !error && bestSupplier &&
                <Box display={'flex'} flexDirection={'column'} w={{base: '100%', lg: '30%'}} bg={primaryColor} p={5} rounded={25} mt={10}>
                    { bestSupplier && bestSupplier.length > 0 && 
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} >
                            <Text fontSize={'xl'} mb={2}>Best Supplier Profession</Text>
                            <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} alignItems={'center'} gap={2}>
                                <Text fontSize={'xl'}>{bestSupplier[0].supplierProfession}</Text>
                                <Text>Earn: ${bestSupplier[0].totalEarnings}</Text>
                            </Box>
                        </Box>                    
                    }
                    { bestSupplier && bestSupplier.length === 0 &&
                        <Text fontSize={'xl'} color={'white'} textAlign={'center'} >No best supplier found. Try other dates!</Text>
                    }
                </Box>
            }
        </Box>
    )
}

const BestBuyersTab = () => {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [limit, setLimit] = useState(3);
    const [bestBuyers, setBestBuyers] = useState(null);
    const [error, setError] = useState(null);

    const toast = useToast();
    let primaryColor = '#512B81';

    const search = async () => {
        let dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        limit === '' ? setLimit(3) : null;
        
        if (dateFrom && dateTo){
            if(dateRegex.test(dateFrom) && dateRegex.test(dateTo) && /^\d+$/.test(limit)) {

                await axios.get(`/api/admin/getBestBuyers?from=${dateFrom}&to=${dateTo}&limit=${limit}`)
                .then(function (response) {
                    let best = response.data.length > 0 ? response.data : [];
                    setBestBuyers(best);
                    setError(null);
                })
                .catch(function (error) {
                    let message = error.response?.data?.error ? error.response?.data?.error : error.response?.data?.message ? error.response?.data?.message : 'An error occurred';
                    setError(message);
                    setBestBuyers(null);
                    toast({
                        title: 'Error',
                        description: message,
                        status: 'error',
                        duration: 9000,
                        isClosable: true
                    });
                })
            }            
        }
    }

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} gap={4} >
            <Text fontSize={'xl'} mb={5}>Select two dates to search for best supplier in a period of time.</Text>
            <Flex direction={'row'} alignItems={'center'} wrap={'wrap'} w={'100%'} mb={5}>
                <Flex direction={'column'} alignContent={'center'} wrap={'wrap'} w={'50%'}>
                    <Text mb={2}>From</Text>
                    <Input type={'date'} w={{base: '98%', lg: '60%'}} onChange={(e) => setDateFrom(e.target.value)}/>
                </Flex>
                <Flex direction={'column'} alignContent={'center'} wrap={'wrap'} w={'50%'}>
                    <Text mb={2}>To</Text>
                    <Input type={'date'} w={{base: '98%', lg: '60%'}} onChange={(e) => setDateTo(e.target.value)}/>
                </Flex>
            </Flex>
            <Flex direction={'column'} alignContent={'center'} wrap={'wrap'} w={'30%'}>
                <Text mb={2}>Limit results</Text>
                <Input placeholder='default 3' type={'number'} onChange={(e) => setLimit(e.target.value)}/>
            </Flex>
            <Button w={'30%'} colorScheme={'purple'} onClick={search}>Search</Button>

            { !error && bestBuyers &&
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} w={'100%'} bg={primaryColor} p={5} rounded={25} mt={5}>
                    { bestBuyers && 
                        <>
                            <Text fontSize={'xl'} mb={4}>Best Buyers</Text>
                            <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} gap={5} alignItems={'center'} justifyContent={'center'} >
                                { bestBuyers.map((buyer) => {
                                    return (
                                        <Box key={buyer.buyerId} display={'flex'} flexDirection={'column'} flexWrap={'wrap'} alignItems={'center'} gap={2} mb={5} border={'1px solid white'} p={3} rounded={25} >
                                            <Text fontSize={'xl'}>{`${buyer.buyerFirstName} ${buyer.buyerLastName}`}</Text>
                                            <Text>{buyer.buyerProfession}</Text>
                                            <Text>Spent: ${buyer.totalPaid.toFixed(2)}</Text>
                                        </Box>
                                    )
                                })}
                            </Box>    
                        </>                
                    }
                    { bestBuyers && bestBuyers.length === 0 &&
                        <Text fontSize={'xl'} color={'white'} textAlign={'center'} >No best supplier found. Try other dates!</Text>
                    }
                </Box>
            }
        </Box>
    )
}


export default AdminView;