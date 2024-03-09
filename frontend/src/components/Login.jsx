import { useContext, useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Avatar,
  FormControl,
  InputRightElement,
  Link as ChakraLink,
  useDisclosure
} from "@chakra-ui/react";
import { FaPhoneAlt, FaLock } from "react-icons/fa";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import { LoginContext } from '../context/LoginContext.js';
import Popup from './Popup.jsx'

const CFaPhone = chakra(FaPhoneAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const API_URL = import.meta.env.VITE_API_URL

  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setPassword] = useState();
  const phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  const { setIsLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();

  //for popup
  const { isOpen: isPopUpOpen, onOpen: onPopupOpen, onClose: onPopUpClose } = useDisclosure()
  const [popContent, setPopupContent] = useState({ title: "", msg: "" })

  const handleShowClick = () => setShowPassword(!showPassword);

  const handlePhoneNumberChange = (e) => {

    let number = e.target.value;
    // Test the input against the regular expression
    setIsPhoneNumberValid(!phoneNumberPattern.test(number));
    setPhoneNumber(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phoneNumberPattern.test(phoneNumber)) {
      setPopupContent({ title: "Error", msg: "Enter Correct Phone Number" })
      onPopupOpen()
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.post(`${API_URL}/login`, {
        phoneNumber: phoneNumber,
        password: password,
      });
      console.log(response.data);
      const token = response.data.token;

      localStorage.setItem("token", token)
      
      setIsLoggedIn(true)
      setIsLoading(false)
      navigate("/")
    } catch (error) {
      setPopupContent({ title: "Error", msg: error.response.data.detail })
      onPopupOpen()
      setIsLoading(false)
    }
  }

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      marginTop={16}
      className="animate__animated animate__fadeIn"
    >
      <Popup title={popContent.title} msg={popContent.msg} isOpen={isPopUpOpen} onOpen={onPopupOpen} onClose={onPopUpClose} />

      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="blue.500" />
        <Heading color="blue.400">Welcome Back</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaPhone color="gray.300" />}
                  />
                  <Input isInvalid={isPhoneNumberValid}
                    onChange={handlePhoneNumberChange}
                    focusBorderColor={`${isPhoneNumberValid ? "pink.400" : "blue.500"}`}
                    value={phoneNumber}
                    type="text"
                    placeholder="Enter Phone Number" />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}

                  />
                  <InputRightElement
                    _hover={{ color: "blue.500", }}
                    style={{ cursor: "pointer" }}
                    onClick={handleShowClick}>
                    {showPassword ? <BiSolidHide /> : <BiSolidShow />}
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                isLoading={isLoading ? true : false}
                type="submit"
                colorScheme="blue"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{" "}
        <ChakraLink color="teal.500">
          <Link to="/signup">
            Sign Up
          </Link>
        </ChakraLink>
      </Box>
    </Flex>
  );
};

export default Login;
