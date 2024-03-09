import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Box, Button, Container, Heading, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import '../styles.css'
import { Popup } from './Index.js'
import { useDisclosure } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom'

const Home = () => {

  const { isOpen: isPopUpOpen, onOpen: onPopupOpen, onClose: onPopUpClose } = useDisclosure()
  const [popContent, setPopupContent] = useState({ title: "Information", msg: "You are using free trial of this application. Subscribe to our application to enjoy uninterrupted service" })


  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      const { isSubscribed } = jwtDecode(token);

      if (!isSubscribed)
        setTimeout(() => {
          onPopupOpen()
        }, 2000)
    }

  }, [])


  return (
    <Box h="95vh" centerContent pt={4} className='with-overlay animate__animated animate__fadeIn' display="flex" justifyContent="center" alignItems="center" >

      <Popup title={popContent.title} msg={popContent.msg} isOpen={isPopUpOpen} onOpen={onPopupOpen} onClose={onPopUpClose}>
        <Link to="/subscribe">
          <Button colorScheme='orange' mt={4}>Subscribe Now</Button>  
        </Link>
      </Popup>


      <Container centerContent>
        <Heading color="white" textAlign="center">Heading Goes Here!</Heading>
        <Text m={4} textAlign="center" color="white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores repellendus distinctio quod modi saepe consequuntur accusantium animi sit cum magni!</Text>

        <Link to="/calculator">
        <Button rightIcon={<ArrowForwardIcon />} colorScheme='orange'>
          Get Started
        </Button>
        </Link>
      </Container>

    </Box>
  )
}

export default Home