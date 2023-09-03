import { Flex, Box, FormControl, FormLabel, FormErrorMessage, Input, Stack, Button, Center, Avatar, useColorModeValue, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { colord } from "colord";
import { FaUserAstronaut } from 'react-icons/fa';
import { GiDoubleFaceMask } from 'react-icons/gi';

export default function SignInPage ({gradientOfTheDay}) {
    const toast = useToast();
    const router = useRouter();
    const [submitIsLoading, setSubmitIsLoading] = useState(false);

    const { register, formState: { errors }, handleSubmit } = useForm();

    const onSubmit = (data) => {
        Cookies.remove('auth_service');
        setSubmitIsLoading(true);
        
        axios.post('/api/login', data)
            .then(res => {
                const { user } = res.data;
                const { auth_service } = res.data.sessionCookie;

                localStorage.setItem('user', JSON.stringify(user));

                Cookies.set('auth_service', auth_service, {
                    expires: 0.5
                });

                router.push('/');
            })
            .catch(err => {

                console.error(err);

                toast({
                    position: 'top',
                    isClosable: true,
                    render: () => (
                        <Box bg={'#282828'} color={'white'} p={4} rounded={'xl'}>
                            Las credenciales no pertenecen a ningún usuario
                        </Box>
                    )
                })
            })
            .finally(e => setSubmitIsLoading(false));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue(`linear-gradient(to right, ${gradientOfTheDay})`, 'gray.800')}
            >
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
    
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('rgba(13, 13, 13, .5)', 'gray.700')}
                        boxShadow={'0px 5px 28px 0px rgba(0,0,0,0.4)'}
                        p={10}>
                        <Center mb={5}>
                            <Avatar size="xl" bg={'rgb(224, 224, 235, 0.5)'} color={'rgb(250, 250, 250, 0.8)'} icon={<GiDoubleFaceMask fontSize='4.5rem' />} />
                        </Center>
                        <Stack spacing={4} color={'white'}>
                            <FormControl id="username" isInvalid={errors.username}>
                                <FormLabel>Usuario</FormLabel>
                                <Input type="text" {...register("username", { required: true })}/>
                                {
                                    errors.username && <FormErrorMessage>El usuario es obligatorio.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl id="password" isInvalid={errors.password}>
                                <FormLabel>Contraseña</FormLabel>
                                <Input type="password"{...register("password", { required: true })}/>
                                {
                                    errors.password && <FormErrorMessage>La contraseña es obligatoria.</FormErrorMessage>
                                }
                            </FormControl>
                            <Stack spacing={10} mt={3}>
                                <Button
                                    bg={gradientOfTheDay.split(',')[0]}
                                    color={'white'}
                                    _hover={{
                                        bg: colord(gradientOfTheDay.split(',')[0]).darken(0.05).toHex()
                                    }}
                                    onClick={handleSubmit(onSubmit)}
                                    isLoading={submitIsLoading}
                                >
                                    Ingresar
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </form>
    );
}


export const getServerSideProps = async (ctx) => {
    const gradients = [
        `#418CB7,#FBDA61`,
        `#059E92,#32b49d,#51caa7,#70e0af,#8FF6B7 `,
        `#0A2A88,#59CDE9`,
        `#0093E9, #80D0C7`,
        `#C34F82, #2D294A`,
        `#418CB7,#FF8570`,
        `#4766f4,#b6f3c9`];

    const gradientOfTheDay = gradients[dayjs().format('d')];

    return {
        props: {
            gradientOfTheDay
        }
    }
}