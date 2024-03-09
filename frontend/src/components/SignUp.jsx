import { useState } from "react";
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
  Select,
  Link as ChakraLink,

  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock, FaUniversity, FaPhoneAlt } from "react-icons/fa";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom"
import OTP from './OTP.jsx'
import axios from 'axios';
import { Popup } from './Index.js'


const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const CFaPhone = chakra(FaPhoneAlt);
const CMdEmail = chakra(MdEmail);
const CFaUniversity = chakra(FaUniversity);



const SingUp = () => {
  const API_URL = import.meta.env.VITE_API_URL



  const { isOpen: isPopUpOpen, onOpen: onPopupOpen, onClose: onPopUpClose } = useDisclosure()
  const [popContent, setPopupContent] = useState({ title: "Information", msg: "You are using free trial of this application. Subscribe to our application to enjoy uninterrupted service" })

  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [showPassword, setShowPassword] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState();
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")

  const phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  const [formData, setFormData] = useState({
    name: '',
    collegeName: '',
    phoneNumber: '',
    email: '',
    userType: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    if (name === 'phoneNumber') {
      setIsPhoneNumberValid(!phoneNumberPattern.test(value));
      setFormData({ ...formData, phoneNumber: value });
    }
  };


  const handleShowClick = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!phoneNumberPattern.test(formData.phoneNumber)) {

      setIsError(true)
      setErrorMsg("Enter Correct Phone Number")
      setTimeout(() => {
        setIsError(false)
        setErrorMsg("")
      }, 4000)
      return;
    }

    const url = `${API_URL}/register`;
    const requestBody = {
      "name": formData.name,
      "collegeName": formData.collegeName,
      "email": formData.email,
      "phoneNumber": formData.phoneNumber,
      "password": formData.password,
      "useFor": formData.userType,
    };

    try {
      setIsLoading(true)
      const response = await axios.post(url, requestBody);

      console.log('Response:', response.data);

      onOpen()
      setIsLoading(false)

    } catch (error) {
      let statusCode = error.response.status;

      console.log(error.response.status)

      if (statusCode === 400) {
        setPopupContent({ title: "Error", msg: error.response.data.detail })
        onPopupOpen()
        setIsLoading(false)
        return;
      }

      setPopupContent({ title: "Error", msg: "Something went wrong..!" })
      onPopupOpen()
      setIsLoading(false)
      return
    }
  }

  return (
    <Flex
      flexDirection="column"
      // width="100wh"
      // height="100vh"
      justifyContent="center"
      alignItems="center"
      marginTop={16}
      className="animate__animated animate__fadeIn"
    >

      <Popup title={popContent.title} msg={popContent.msg} isOpen={isPopUpOpen} onOpen={onPopupOpen} onClose={onPopUpClose}>
      </Popup>

      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="blue.500" />
        <Heading color="blue.400">Welcome</Heading>

        {
          isError &&
          <Alert status='error'>
            <AlertIcon />
            {errorMsg}
          </Alert>
        }

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
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter You Name" />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUniversity color="gray.300" />}
                  />
                  <Input
                    type="text"
                    name="collegeName"
                    value={formData.collegeName}
                    onChange={handleChange}
                    placeholder="Enter College Name" />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaPhone color="gray.300" />}
                  />
                  <Input isInvalid={isPhoneNumberValid}
                    onChange={handleChange}
                    value={formData.phoneNumber}
                    focusBorderColor={`${isPhoneNumberValid ? "pink.400" : "blue.500"}`}
                    type="text"
                    name="phoneNumber"
                    placeholder="Enter Phone Number" />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CMdEmail color="gray.300" />}
                  />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter You Email" />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <Select placeholder='Who is going to use?' name="userType" value={formData.userType} onChange={handleChange}>
                  <option value='student'>Student</option>
                  <option value='faculty'>Faculty</option>
                  <option value='option3'>Other</option>
                </Select>

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
                    name="password"
                    onChange={handleChange}
                    value={formData.password}

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
                isLoading={isLoading}
                type="submit"
                colorScheme="blue"
                width="full"
              >
                Sign Up
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        Already have an account?{" "}
        <ChakraLink color="teal.500">
          <Link to="/login">
            Login
          </Link>

        </ChakraLink>
      </Box>


      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verify OTP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <OTP onClose={onClose} phoneNumber={formData.phoneNumber} />
          </ModalBody>
        </ModalContent>
      </Modal>

    </Flex>
  );
};

export default SingUp;
