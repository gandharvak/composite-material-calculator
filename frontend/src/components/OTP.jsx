import { Button, Flex, FormControl, Heading, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { OTPInput } from "chakra-otp-input";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function OTP({ onClose, phoneNumber}) {
    const API_URL = import.meta.env.VITE_API_URL

    const [otpValue, setOtpValue] = useState("");
    const [timer, setTimer] = useState(40);
    const navigate = useNavigate();

    const handleOTPVerification = async () => {
        const url = `${API_URL}/verify_otp`;
        const requestBody = {
          "phoneNumber": phoneNumber,
          "otp": otpValue
        };
    
        try {
          // Using Axios to send a POST request
          const response = await axios.post(url, requestBody);
          // Handling the response data here
          console.log('Response:', response.data);
          alert('OTP Verification successful!');
          navigate("/")
          
        } catch (error) {
          // Handling errors here, including error response from the server
          console.error('Error during OTP verification:', error.response ? error.response.data : error);
          alert('OTP Verification failed!');
        }
      };

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
        onClose()
    }, [timer]);

    return (
        <Flex justify="center" align="center" w="full" className="animate__animated animate__fadeIn">
            <FormControl w="60">
                <Heading color="blue.400" mb={4} textAlign="center">Enter OTP</Heading>
                <OTPInput noInputs={4} boxShadow={"none"} margin="auto" onChange={(value) => setOtpValue(value)} />
                <Button mt="4" w="full" colorScheme="blue" isDisabled={otpValue.length == 4 ? false : true} onClick={handleOTPVerification}>Verify OTP</Button>
                <Text mt={4} color={`${timer < 10 && "tomato"}`} className={`${timer < 10 && "animate-flicker"}`} textAlign="center">
                    {`OTP is valid only for ${timer} seconds`}
                </Text>
            </FormControl>
        </Flex>
    );
}