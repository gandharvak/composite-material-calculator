import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Image,
    VStack,
    Flex,
    Card,
    Button,
    Avatar,
    Text,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';

const ProfilePage = () => {
    const API_URL = import.meta.env.VITE_API_URL
    const toast = useToast();


    const [error, setError] = useState('');
    const [profile, setProfile] = useState({
        name: '',
        collegeName: '',
        email: '',
        useFor: '',
        phoneNumber: '', // assuming a dummy phone number
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const updateUser = async () => {
        const url = 'http://127.0.0.1:8000/6613ca37b5a2bb7994185be3';
    
        try {
          const response = await axios.patch(url, profile);
          toast({
            title: 'Success',
            description: `User Data Updated Successfully!`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } catch (error) {
          console.error('Error updating user:', error);
          toast({
            title: 'Error updating user',
            description: error.response?.data?.message || 'An error occurred',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };    

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_URL}/6613ca37b5a2bb7994185be3`);
                setProfile(response.data);
                setError('');  // Clear any previous errors
            } catch (err) {
                setProfile(null);  // Clear previous user data
                setError('Failed to fetch user data');
                console.error('Error fetching user data:', err);
            }
        };

        fetchUserData();
    }, []);

    return (
        <Box>
            {error ? (
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : profile ? (
                <Box>
                    <Flex justifyContent="center" p={4}>
                        <Card p={4} w="300px">
                            <VStack spacing={4} align="stretch">
                                <Flex justifyContent="center">
                                    <Avatar name={profile.name} src='https://bit.ly/broken-link' fontSize="50px" />
                                </Flex>

                                <FormControl id="name">
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl id="collegeName">
                                    <FormLabel>College Name</FormLabel>
                                    <Input
                                        type="text"
                                        name="collegeName"
                                        value={profile.collegeName}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl id="email">
                                    <FormLabel>Email ID</FormLabel>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl id="useFor" isReadOnly>
                                    <FormLabel>Use For</FormLabel>
                                    <Input
                                        type="text"
                                        name="useFor"
                                        value={profile.useFor}
                                        onChange={handleChange}
                                    />
                                </FormControl>

                                <FormControl id="phoneNumber" isReadOnly>
                                    <FormLabel>Phone Number</FormLabel>
                                    <Input
                                        type="text"
                                        name="phoneNumber"
                                        value={profile.phoneNumber}
                                        isReadOnly
                                    />
                                </FormControl>
                                <Button colorScheme='blue' onClick={updateUser}>Update Profile</Button>
                            </VStack>
                        </Card>
                    </Flex>
                </Box>
            ) : (
                <Text>Loading user data...</Text>
            )}
        </Box>
    );
};

export default ProfilePage;
