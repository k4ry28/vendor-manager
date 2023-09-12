import axios from 'axios';
import { useToast, Box, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import dayjs from 'dayjs';
import SignForm from '@/components/signForm.js';
import { MdError, MdCheckCircle } from 'react-icons/md';

export default function SignInPage ({gradientOfTheDay}) {
    const toast = useToast();
    const router = useRouter();
    const [submitIsLoading, setSubmitIsLoading] = useState(false);


    const onSubmit = (data) => {
        setSubmitIsLoading(true);
        
        axios.post('/api/signup', data)
            .then(res => {
                toast({
                    position: 'top',
                    isClosable: true,
                    render: () => (
                        <Box display={'flex'} alignItems={'center'} bg={'#282828'} color={'white'} p={4} rounded={'xl'}>
                            <Icon as={MdCheckCircle} color={'green.500'} mr={3} boxSize={6} />
                            {'Account created successfully.'}
                        </Box>
                    )
                });

                // redirect to login after 2 seconds
                setTimeout(() => {
                    router.push('/login')
                }, 2000);
                
            })
            .catch(err => {

                toast({
                    position: 'top',
                    isClosable: true,
                    render: () => (
                        <Box display={'flex'} alignItems={'center'} bg={'#282828'} color={'white'} p={4} rounded={'xl'}>
                            <Icon as={MdError} color={'red.500'} mr={3} boxSize={6} />
                            {err.response?.data?.error ? err.response?.data?.error : 'There was an unexpected error.'}
                        </Box>
                    )
                });

                setSubmitIsLoading(false)
            });
    }

    return (
        <>
            <SignForm
                submitIsLoading={submitIsLoading}
                gradientOfTheDay={gradientOfTheDay}            
                onSubmit={onSubmit}
                signup={true}
            />
        </>
    )
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