import { Box, Text, Flex, Icon, Button, Input, InputGroup, InputLeftElement, useDisclosure, useToast  } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MdOutlinePostAdd, MdOutlineAddToPhotos, MdOutlineAttachMoney, MdOutlineVerticalAlignBottom, MdAddTask } from 'react-icons/md';
import useSWR, { mutate } from 'swr';
import fetcher from '@/utils/fetcher';
import UserSessionMenu from '@/components/userSessionMenu.js';
import BalanceAndPaidCards from '@/components/balanceAndPaidCards.js';
import TitleGradientStroke from '@/components/titleGradientStroke.js';
import SideNavbar from '@/components/sideNavbar.js';
import axios from 'axios';


const AccountView = ({id, type}) => {
    const [accountInfo, setAccountInfo] = useState(null);
    const [error, setError] = useState(null);
    const [reload, setReload] = useState(null);

    let bgColor = '#000119';

    const { data } = useSWR(`/api/account/getAccountInfoById?account_id=${id}`, fetcher);

    const { isOpen: isDepositOpen, onOpen: onDepositOpen, onClose: onDepositClose } = useDisclosure();
    
    useEffect(() => {
        if(data && !data.error){
            setAccountInfo(data);
            setError(null);
        }
        else if(data && data.error){
            setError(data.error);
            setAccountInfo(null);
        }
        
    }, [data]);

    useEffect(() => {
        mutate(`/api/account/getAccountInfoById?account_id=${id}`);
    }, [reload])
    
    return (
        <Box bg={bgColor}  w={'100%'} display={'flex'} flexDirection={{base: 'column', lg: 'row'}} flexWrap={'wrap'} > 
            <SideNavbar accountId={id} type={type} />
            
            <Box w={{base: '100%', lg: '75%', xl: '80%'}} display={'flex'} flexDirection={'column'} mx={'auto'} gap={10} >
                <Flex w={'100%'} alignItems={'center'} justifyContent={{base: 'center', lg: 'space-between'}}>
                    { accountInfo ?
                        <BalanceAndPaidCards balance={accountInfo.account?.balance? accountInfo.account?.balance : 0} unpaid_submissions={accountInfo.unpaid_submissions} />
                        :
                        <Box></Box>
                    }
                    <Box display={{base: 'none', lg: 'flex'}}>
                        <UserSessionMenu />
                    </Box>
                </Flex>
                { accountInfo &&
                    <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} w={'100%'} >
                        <TitleGradientStroke title={`Hi ${accountInfo.account?.firstName}!`}/>
                        <Text fontSize={{base: 'lg', lg: '2xl'}} mb={5} color={'white'} alignSelf={'center'}> Here are some shortcuts for you... </Text>
                        
                        { type === 'buyer' &&
                            <>
                                <Box as={'button'} mb={7} display={'flex'} flexDirection={'column'} flexWrap={'wrap'} alignSelf={'center'} justifyContent={'center'} alignContent={'center'} bg={'#512B81'} color={'white'} rounded={25} p={4} w={{base: '40%', lg: '30%'}}>
                                    <Icon as={MdOutlineAttachMoney} boxSize={12} bg={'white'} color={'#0099ff'} p={2} rounded={100} mx={'auto'} mb={2} />
                                    <Text fontWeight={'semibold'} textAlign={'center'}> Pay Submission </Text>
                                </Box>
                                <Box as={'button'} mb={7} display={'flex'} flexDirection={'column'} flexWrap={'wrap'} alignSelf={'center'} justifyContent={'center'} alignContent={'center'} 
                                    bg={'#512B81'} color={'white'} rounded={25} p={4} w={{base: '40%', lg: '30%'}} onClick={onDepositOpen}>
                                    <Icon as={MdOutlineVerticalAlignBottom} boxSize={12} bg={'white'} color={'#0099ff'} p={2} rounded={100} mx={'auto'} mb={2} />
                                    <Text fontWeight={'semibold'} textAlign={'center'}> Deposit </Text>
                                </Box>
                                <Box as={'button'} mb={7} display={'flex'} flexDirection={'column'} flexWrap={'wrap'} alignSelf={'center'} justifyContent={'center'} alignContent={'center'} bg={'#512B81'} color={'white'} rounded={25} p={4} w={{base: '40%', lg: '30%'}}>
                                    <Icon as={MdOutlinePostAdd} boxSize={12} bg={'white'} color={'#0099ff'} p={2} rounded={100} mx={'auto'} mb={2} />
                                    <Text fontWeight={'semibold'} textAlign={'center'}> Create Agreement </Text>
                                </Box>

                                <DepositModal isOpen={isDepositOpen} OnClose={onDepositClose} unpaid={accountInfo.unpaid_submissions} accountId={id} setReload={setReload} />
                            </>
                        }

                        { type === 'supplier' &&
                            <>
                                <Box as={'button'} mb={7} display={'flex'} flexDirection={'column'} flexWrap={'wrap'} alignSelf={'center'} justifyContent={'center'} alignContent={'center'} bg={'#512B81'} color={'white'} rounded={25} p={4} w={{base: '40%', lg: '30%'}}>
                                    <Icon as={MdAddTask} boxSize={12} bg={'white'} color={'#0099ff'} p={2} rounded={100} mx={'auto'} mb={2} />
                                    <Text fontWeight={'semibold'} textAlign={'center'}> Create Submission </Text>
                                </Box>
                            </>
                        }
                    </Box>
                }
                { error &&
                    <Box textAlign={'center'} bg={'#512B81'} mb={5} color={'white'} p={4} rounded={25} fontSize={'2xl'}>
                        <Text color={'white'} mb={5}> {error} </Text>
                        <Image src={'/images/404.jpg'} alt="error" width={400} height={400}/>
                    </Box>
                }
            </Box>
        </Box>
    )
}


const DepositModal = ({isOpen, OnClose, unpaid, accountId, setReload}) => {
    const [depositAmount, setDepositAmount] = useState(null);
    const toast = useToast();

    const handleInputChange = (e) => {
        setDepositAmount(e.target.value);        
    }

    const handleOnClose = () => {
        setDepositAmount(null);
        OnClose();
    }
    
    const depositMoney = async () => {
        if(/^\d+(\.\d{1,2})?$/.test(depositAmount)) {
            await axios.post(`/api/account/deposit?account_id=${accountId}`, { amount: depositAmount })
            .then(response => {
                toast({
                    title: 'Money deposited!',
                    description: response.data.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setReload(new Date());
                handleOnClose();
            })
            .catch(error => {
                toast({
                    title: error.response?.data?.error,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            });
        }
    }

    return (
        <Modal onClose={OnClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Deposit in Account</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Text>Remember that you can't deposit more than <strong>10%</strong> of the total submissions to pay.</Text>
                    <Text mt={3}>Limit: ${(unpaid * 1.1).toFixed(2)}</Text>

                    <InputGroup mt={5}>
                        <InputLeftElement
                            pointerEvents='none'
                            color='gray.300'
                            fontSize='1.2em'
                            children='$'
                        />
                        <Input placeholder='Enter amount' type='number' onChange={handleInputChange} />
                    </InputGroup>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={depositMoney}>Deposit</Button>
                    <Button onClick={OnClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

AccountView.getInitialProps = async ({ query }) => {
    const {id, type} = query;
    return {id, type};
}

export default AccountView;