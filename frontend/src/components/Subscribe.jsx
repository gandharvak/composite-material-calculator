import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardFooter, Container, Divider, Heading, Image, Stack, Text, useDisclosure } from '@chakra-ui/react'
import axios from 'axios';
import { Popup } from './Index.js'

import { jwtDecode } from 'jwt-decode';
import { loadRazorpay } from '../utils/Payment.js'

const Subscribe = () => {
  const API_URL = import.meta.env.VITE_API_URL


  const { isOpen: isPopUpOpen, onOpen: onPopupOpen, onClose: onPopUpClose } = useDisclosure()
  const [popContent, setPopupContent] = useState({ title: "", msg: "" })
  const [isLoading, setIsLoading] = useState(false);


  const token = localStorage.getItem("token")
  const userData = jwtDecode(token);
  const [isSubscribed, setIsSubscribed] = useState(userData.isSubscribed);

  let order_id = null;
  const amount = 549;

  const handleUnsubscribe = async () => {
    const url = `${API_URL}/unsubscribe`

    try {
      setIsLoading(true)
      const response = await axios.post(url, {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      localStorage.setItem("token", response.data.token);
      setIsSubscribed(response.data.isSubscribed)

      setPopupContent({title:"Success", msg:"Unsubscribed Successfull!"})
      onPopupOpen()

      setIsLoading(false)

    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const handleSubscribe = async () => {
    setIsLoading(true)
    await createPaymentOrder()
    loadRazorpay(order_id, amount, setIsSubscribed)
    setIsLoading(false)
  }

  const createPaymentOrder = async () => {
    try {
      const url = `${API_URL}/create_payment_order?amount=${amount}`;

      const response = await axios.post(url, {});

      console.log('Order ID:', response.data.order_id);
      order_id = response.data.order_id;
    } catch (error) {
      console.error('Error creating payment order:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  return (
    <Container centerContent pt={4} className='animate__animated animate__fadeIn'>

      <Popup title={popContent.title} msg={popContent.msg} isOpen={isPopUpOpen} onOpen={onPopupOpen} onClose={onPopUpClose}>
      </Popup>

      <Heading color="blue.500" mb={4}>Get Our Subscription</Heading>
      <Card maxW='sm'>
        <CardBody>
          <Image
            src='https://cdn.pixabay.com/photo/2014/07/06/13/55/calculator-385506_1280.jpg'
            alt='Green double couch with wooden legs'
            borderRadius='lg'
          />
          <Stack mt='6' spacing='3'>
            <Heading size='md'>Calculator</Heading>
            <Text>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse maxime ducimus iusto, corrupti quibusdam aut officia perferendis! Reprehenderit, dolores beatae!
            </Text>
            <Text color='blue.600' fontSize='2xl'>
              ₹ {amount}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          {
            isSubscribed ?
              <Button isLoading={isLoading} variant='solid' w="full" colorScheme='red' onClick={handleUnsubscribe}>
                Unsubscribe
              </Button>

              :

              <Button isLoading={isLoading} variant='solid' w="full" colorScheme='whatsapp' onClick={handleSubscribe}>
                Subscribe
              </Button>


          }

        </CardFooter>
      </Card>

    </Container>
  )
}

export default Subscribe