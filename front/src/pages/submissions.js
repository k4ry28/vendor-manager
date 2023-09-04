import { Box, Text, Flex, Icon, IconButton, Badge, Button, useToast } from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { HiMenu, HiOutlineUser, HiOutlineInformationCircle, HiOutlineDocumentText } from 'react-icons/hi';
import { BsCalendarDate } from 'react-icons/bs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import useSWR, { mutate } from 'swr';
import fetcher from '@/utils/fetcher';
import axios from 'axios';
import UserSessionMenu from '@/components/userSessionMenu.js';
import SideNavbar from '@/components/sideNavbar.js';


const SubmissionsView = ({acc, type}) => {
    const [submissions, setSubmissions] = useState(null);
    const [error, setError] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [reload, setReload] = useState(null);

    let bgColor = '#000119';
    let primaryColor = '#512B81';
    let primaryDarker = '#1D0C33';

    const { data } = useSWR(`/api/submissions/getUnpaidSubmissions?account_id=${acc}`, fetcher);
        
    useEffect(() => {
        if(data && !data.error){
            setSubmissions(data);
            setError(null);
        }
        else if(data && data.error){
            setError(data.error);
            setSubmissions(null);
        }
        
    }, [data]);

    useEffect(() => {
        mutate(`/api/submissions/getUnpaidSubmissions?account_id=${acc}`);
    }, [reload])
    
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
                { submissions &&
                    <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} alignContent={'center'} gap={10} w={'80%'} h={'100%'} bg={primaryDarker} rounded={25}>
                        <Text fontSize={{base: 'lg', lg: '3xl'}} mt={5} color={'white'} alignSelf={'center'}> Unpaid Submissions </Text>
                        { submissions.map(submission => (
                            <SubmissionCard key={submission.id} submission={submission} user={userInfo} setReload={setReload} />
                        ))}
                    </Box>
                }
                { error &&
                    <Box textAlign={'center'} bg={primaryDarker} color={'white'} p={4} rounded={25} fontSize={'2xl'}>
                        <Text color={'white'} mb={5}> {error} </Text>
                        <Image src={'/images/404.jpg'} alt="error" width={400} height={400}/>
                    </Box>
                }
            </Box>
        </Box>
    )
}

const SubmissionCard = ({submission, user, setReload}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    let primaryColor = '#512B81';
    let primaryDarker = '#1D0C33';
    let secondaryColor = '#4477CE';

    const handleOnClose = () => {
        onClose();
        setReload(new Date());
    }

    return (
        <Box display={'flex'} flexDirection={'row'} w={'60%'} justifyContent={'center'} bg={primaryColor} color={'white'} rounded={25} p={4} >
            <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} justifyContent={'center'} alignContent={'center'} gap={2}  w={'100%'} fontSize={18}>
                <Box display={'flex'} flexDirection={'row'} gap={10}>
                    <Text><Icon as={HiOutlineUser} mr={2}/><strong>Buyer:</strong> {`${submission.Agreement.Buyer.firstName} ${submission.Agreement.Buyer.lastName}`} </Text>
                    <Text><Icon as={HiOutlineUser} mr={2}/><strong>Supplier:</strong> {`${submission.Agreement.Supplier.firstName} ${submission.Agreement.Supplier.lastName}`} </Text>
                </Box>
                <Text><Icon as={HiOutlineInformationCircle} mr={2}/><strong>Status:</strong> <Badge colorScheme={'red'}>{submission.paid ? 'Paid' : 'Unpaid'}</Badge> </Text>
                <Text><Icon as={BsCalendarDate} mr={2}/><strong>Date:</strong> {dayjs(submission.createdAt).format('DD/MM/YYYY')} </Text>
                <Text><Icon as={HiOutlineDocumentText} mr={2}/><strong>Price:</strong> ${submission.price} </Text>
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
                        { submission.Agreement.Buyer.id === user.id &&
                            <MenuItem bg={primaryDarker} textAlign={'center'} _hover={{bg: secondaryColor}} color={'white'} onClick={onOpen}>Pay</MenuItem>
                        }
                        { submission.Agreement.Supplier.id === user.id &&
                            <MenuItem bg={primaryDarker} textAlign={'center'} _hover={{bg: secondaryColor}} color={'white'} >Edit</MenuItem>
                        }
                        <MenuItem bg={primaryDarker} textAlign={'center'} _hover={{bg: secondaryColor}} color={'white'} >See Agreement</MenuItem>
                    </MenuList>
                </Menu>
                <PaySubmissionModal isOpen={isOpen} handleOnClose={handleOnClose} submission={submission} />
            </Box>
        </Box>
    )
}

const PaySubmissionModal = ({isOpen, handleOnClose, submission}) => {
    const toast = useToast();

    const sendMoney = async () => {
        await axios.post('/api/submissions/paySubmission', {
            id: submission.id
        })
        .then(response => {
            toast({
                title: 'Submission paid',
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
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
    
    return (
        <Modal onClose={handleOnClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Pay Submission</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Text>Are you sure you want to pay this submission?</Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={sendMoney}>Pay</Button>
                    <Button onClick={handleOnClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

SubmissionsView.getInitialProps = async ({ query }) => {
    const {acc, type} = query;
    return {acc, type};
}



export default SubmissionsView;