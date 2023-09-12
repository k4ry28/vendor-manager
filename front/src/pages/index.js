import { Box, Text, Flex, Icon, Button, FormControl, FormLabel, FormErrorMessage, Input, Radio, RadioGroup, useToast } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { TbCircleLetterB, TbCircleLetterS, TbCirclePlus } from 'react-icons/tb';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import UserSessionMenu from '@/components/userSessionMenu.js';
import TitleGradientStroke from '@/components/titleGradientStroke.js';
import Link from "next/link";
import { useForm } from 'react-hook-form';


export default function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserInfo(user);

    axios.get(`/api/account/getAccounts?user_id=${user.id}`)
      .then(function (response) {
        setAccounts(response.data);
        setError(null);
      })
      .catch(function (error) {
        setError(error.response?.data);
        setAccounts([]);
      });
  }, []);

  return (
    
      <Box h={{base: '100vh', lg: '90vh'}} w={'80%'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} mx={'auto'} gap={10} >
        <Flex w={'100%'} alignItems={'center'} justifyContent={'end'} display={{ base: 'none', lg: 'flex'}}>
          <UserSessionMenu />
        </Flex>
        <TitleGradientStroke title={'Welcome to Vendor Manager App'}/>
        <Text fontSize={{base: 'lg', lg: '2xl'}} color={'white'} textAlign={'center'} > Select an account to start or create a new one: </Text>
        <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'center'} alignContent={'center'} gap={10}>
          { accounts.length > 0 &&
            accounts.map((account) => {
              return <AccountSelector key={account.id} account={account} />
            })
          }
          { accounts.length < 2 &&
            <Box as='button' _hover={{transform: 'scale(1.15)', transition: 'all 0.2s ease-in-out', cursor: 'pointer'}} onClick={onOpen}>
              <Icon as={TbCirclePlus} boxSize={12} bg={'white'} rounded={100} mb={1} />
              <Text fontSize={'xl'} color={'white'} > NEW </Text>
              <NewAccountModal isOpen={isOpen} onClose={onClose} user={userInfo} />
            </Box>
          }          
        </Box>
        { userInfo && userInfo.role === 'admin' &&
          <Box>
            <Text fontSize={'lg'} color={'white'} textAlign={'center'} > ...or go to </Text>
            <Link href={'/admin'}>
              <Text fontSize={'lg'} color={'purple.300'} textDecor={'underline'} textAlign={'center'} > Admin Page </Text>
            </Link>
          </Box>
        }
      </Box>
    
  )
}


const AccountSelector = ({account}) => {
  return (
    <Link href={{ pathname: `/account/${account.id}`, query: { type: account.type } }}>
       <Box display={'flex'} flexDirection={'column'} alignItems={'center'} _hover={{transform: 'scale(1.15)', transition: 'all 0.2s ease-in-out', cursor: 'pointer'}} >
        <Icon as={account.type === 'buyer' ? TbCircleLetterB : TbCircleLetterS} boxSize={12} bg={'white'} rounded={100} mb={3} />
        <Text fontSize={'xl'} color={'white'} > {account.type.toUpperCase()} </Text>      
      </Box> 
    </Link>    
  )
}


const NewAccountModal = ({isOpen, onClose, user}) => {
  let bgColor = '#000119';
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);

  const toast = useToast();

  const onSubmit = (data) => {
    setSubmitIsLoading(true);
    axios.post(`/api/account/new?user_id=${user.id}`, data)
      .then(function (response) {
        toast({
          title: 'Account created',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      })
      .catch(function (error) {
        toast({
          title: error.response?.data?.error ? error.response?.data?.error : 'An unexpected error occurred. Try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => {
        setSubmitIsLoading(false);
      });
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered >
      <ModalOverlay bg='whiteAlpha.400' backdropFilter='blur(10px) hue-rotate(45deg)' />
      <ModalContent bg={bgColor} color={'white'}>
        <ModalHeader >New Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl id="firstName" isInvalid={errors.firstName}>
              <FormLabel>First Name</FormLabel>
              <Input type="text" {...register("firstName", { required: true })} focusBorderColor={"#b366ff"}/>
              {
                errors.firstName && <FormErrorMessage>The name is required.</FormErrorMessage>
              }
            </FormControl>
            <FormControl id="lastName" isInvalid={errors.lastName} mt={4}>
              <FormLabel>Last Name</FormLabel>
              <Input type="text" {...register("lastName", { required: true })} focusBorderColor={"#b366ff"}/>
              {
                errors.lastName && <FormErrorMessage>The last name is required.</FormErrorMessage>
              }
            </FormControl>
            <FormControl id="profession" isInvalid={errors.profession} mt={4}>
              <FormLabel>Profession</FormLabel>
              <Input type="text" {...register("profession", { required: true })} focusBorderColor={"#b366ff"}/>
              {
                errors.profession && <FormErrorMessage>The profession is required.</FormErrorMessage>
              }
            </FormControl>
            <FormControl id="accountType" isInvalid={errors.type} mt={4}>
              <FormLabel>Account Type</FormLabel>
              <RadioGroup  colorScheme={'purple'}>
                <Radio value="buyer" {...register("type", { required: true })}>Buyer</Radio>
                <Radio ml={4} value="supplier" {...register("type", { required: true })}>Supplier</Radio>
              </RadioGroup>
              {
                errors.type && <FormErrorMessage>The account type is required.</FormErrorMessage>
              }
            </FormControl>

          </form>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>Cancel</Button>
          <Button colorScheme='purple' onClick={handleSubmit(onSubmit)}>Create</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}