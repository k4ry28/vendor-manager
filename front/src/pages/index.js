import { Box, Text, Flex, Icon, Button } from '@chakra-ui/react';
import { TbHexagonLetterB, TbHexagonLetterV, TbCirclePlus } from 'react-icons/tb';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import UserSessionMenu from '@/components/userSessionMenu.js';
import TitleGradientStroke from '@/components/titleGradientStroke.js';
import Link from "next/link";


export default function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserInfo(user);

    axios.get(`/api/account/getAccounts?user_id=${user.id}`)
      .then(function (response) {
        setAccounts(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    
      <Box h={{base: '', lg: '90vh'}} w={'80%'} display={'flex'} flexDirection={'column'} alignItems={'center'} mx={'auto'} gap={10} >
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
            <Box as='button'>
              <Icon as={TbCirclePlus} boxSize={12} bg={'white'} rounded={100} mb={1} />
              <Text fontSize={'xl'} color={'white'} > NEW </Text>
            </Box>
          }
        </Box>
      </Box>
    
  )
}


const AccountSelector = ({account}) => {
  return (
    <Link href={{ pathname: `/account/${account.id}`, query: { type: account.type } }}>
      <Icon as={account.type === 'buyer' ? TbHexagonLetterB : TbHexagonLetterV} boxSize={12} bg={'white'} rounded={100} mb={1} mx={2} />
      <Text fontSize={'xl'} color={'white'} > {account.type.toUpperCase()} </Text>
    </Link>
  )
}
