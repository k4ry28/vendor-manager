import { Avatar, Box, Button } from '@chakra-ui/react';
import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const UserSessionMenu = () => {
    const router = useRouter();
    
    function signOut () {
        localStorage.clear('user');
        Cookies.remove('auth_service');
        router.push('/login');
    }

    let primaryColor = '#35155D';
    let primaryLight = '#512B81';

    return (
        <Menu>
            <MenuButton 
                as={Button}
                ml={2}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                leftIcon={<Avatar bg={'#ffffff'} size={'lg'} p={1} src='https://api.dicebear.com/7.x/thumbs/svg?seed=Peanut' />}
            >
                
            </MenuButton>
            <MenuList bg={primaryColor}>               
                <MenuItem bg={primaryColor} textAlign={'center'} _hover={{bg: primaryLight}} color={'white'} onClick={() => signOut()} >Cerrar sesión</MenuItem>
            </MenuList>
        </Menu>
    )
}

export default UserSessionMenu;

