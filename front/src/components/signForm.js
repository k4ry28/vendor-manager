import { Flex, Box, FormControl, FormLabel, FormErrorMessage, Input, Stack, Button, Center, Avatar, Text, useColorModeValue } from '@chakra-ui/react';
import { colord } from "colord";
import { GiDoubleFaceMask } from 'react-icons/gi';
import { useForm } from 'react-hook-form';


const SignForm = ({gradientOfTheDay, onSubmit, submitIsLoading, signup}) => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue(`linear-gradient(to right, ${gradientOfTheDay})`, 'gray.800')}
            >
                <Stack spacing={8} maxW={'lg'} py={12} px={6}>    
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('rgba(13, 13, 13, .5)', 'gray.700')}
                        boxShadow={'0px 5px 28px 0px rgba(0,0,0,0.4)'}
                        p={10}>
                        <Center mb={5}>
                            <Avatar size="xl" bg={'rgb(224, 224, 235, 0.5)'} color={'rgb(250, 250, 250, 0.8)'} icon={<GiDoubleFaceMask fontSize='4.5rem' />} />
                        </Center>
                        <Stack spacing={4} color={'white'}>
                            <Text fontSize={'lg'} textAlign={'center'} fontWeight={'bold'}>
                                {signup ? 'Register User' : ''}
                            </Text>
                            <FormControl id="username" isInvalid={errors.username}>
                                <FormLabel>User</FormLabel>
                                <Input type="text" {...register("username", { required: true })}/>
                                {
                                    errors.username && <FormErrorMessage>The username is required.</FormErrorMessage>
                                }
                            </FormControl>
                            <FormControl id="password" isInvalid={errors.password}>
                                <FormLabel>Password</FormLabel>
                                <Input type="password"{...register("password", { required: true })}/>
                                {
                                    errors.password && <FormErrorMessage>The password is required.</FormErrorMessage>
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
                                    {signup ? 'Sign Up' : 'Login'}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                    <Text textAlign={'center'} fontWeight={'semibold'}>
                        { signup ? 'Already have an account?' : 'Don\'t have an account?' } 
                        <a href={ signup ? '/login' : '/signup' } style={{color:gradientOfTheDay.split(',')[0], marginLeft: '5px', fontWeight: 'bold'}}>
                            {signup ? 'Sign In' : 'Sign Up' }
                        </a>
                    </Text>
                </Stack>
            </Flex>
        </form>
    )
}


export default SignForm;