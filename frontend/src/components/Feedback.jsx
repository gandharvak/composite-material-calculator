import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Textarea,
  Button,
  useToast,
  Flex,
  Heading,
  Stack,
  Card
} from '@chakra-ui/react';
import axios from 'axios';
import { MdCheckCircle, MdCancel, MdSentimentVeryDissatisfied, MdSentimentDissatisfied, MdSentimentNeutral, MdSentimentSatisfied, MdSentimentVerySatisfied } from 'react-icons/md';
import { nanoid } from 'nanoid'
const emojiesForFourOptions = [
  { optionName: "Worst", icon: MdSentimentVeryDissatisfied, color: '#d32f2f' }, // red
  { optionName: "Very bad", icon: MdSentimentDissatisfied, color: '#f44336' }, // dark red
  { optionName: "Bad", icon: MdSentimentNeutral, color: '#ff9800' }, // orange
  { optionName: "Good", icon: MdSentimentSatisfied, color: '#4caf50' }, // green
  { optionName: "Excellent", icon: MdSentimentVerySatisfied, color: '#2e7d32' } // dark green
];

const emojiesForTwoOptions = [
  { optionName: "Yes", icon: MdCheckCircle, color: '#4caf50' }, // green
  { optionName: "No", icon: MdCancel, color: '#f44336' } // red
];

const questions = [
  {
    id: 1,
    name: "needsMet",
    question: "Were your needs and expectations met by our service?",
    options: emojiesForTwoOptions
  },
  {
    id: 2,
    name: "paymentEase",
    question: "Did you able to do the payment easily and securely?",
    options: emojiesForTwoOptions
  },
  {
    id: 3,
    name: "serviceSatisfaction",
    question: "How satisfied are you with the service provided?",
    options: emojiesForFourOptions
  },
  {
    id: 4,
    name: "recommendLikelihood",
    question: "How likely would you recommend our service to others?",
    options: emojiesForFourOptions
  },
  {
    id: 5,
    name: "navigationEase",
    question: "Were you able to easily navigate our website/app?",
    options: emojiesForTwoOptions
  },
  {
    id: 6,
    name: "speedSatisfaction",
    question: "How satisfied are you with the speed and responsiveness of our service?",
    options: emojiesForFourOptions
  },
  {
    id: 7,
    name: "infoClarity",
    question: "Was the information provided clear and helpful?",
    options: emojiesForTwoOptions
  },
  {
    id: 8,
    name: "overallExperience",
    question: "How would you rate your overall experience with our service?",
    options: emojiesForFourOptions
  }
];


function Feedback() {
  const API_URL = import.meta.env.VITE_API_URL
  const [isLoading, setIsLoading] = useState(false);


  const initialFeedback = {
    needsMet: '',
    paymentEase: '',
    serviceSatisfaction: '',
    recommendLikelihood: '',
    navigationEase: '',
    speedSatisfaction: '',
    infoClarity: '',
    overallExperience: '',
    additionalComments: '',
  }
  const [feedback, setFeedback] = useState(initialFeedback);

  const toast = useToast();

  const handleChange = (value, name) => {
    setFeedback(prev => ({ ...prev, [name]: value }));
  };


  const postFeedback = async () => {
    const url = `${API_URL}/feedback/submit`

    try {
      setIsLoading(true)
      const response = await axios.post(url, feedback,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "top"
      });

      setIsLoading(false)

    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    console.log(feedback);
    let allFieldsFilled = true;

    for (const [key, value] of Object.entries(feedback)) {
      if (value === '') {
        allFieldsFilled = false;
        break;
      }
    }

    if (allFieldsFilled) {
      postFeedback();
    } else {
      toast({
        title: 'All fields are required',
        description: "Some fields are empty.",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top"
      });
    }

  };

  return (
    <Flex w="full" justifyContent={'center'}>
      <Flex bg="white" p={4} flexDir="column" width={{ base: "100%", sm: "500px", md: "700px" }}>
        <Heading textAlign="center" color="blue.500" mb={4}>Feedback</Heading>

        {
          questions?.map((question, i) => {
            return (
              <Card p={4} mb={4} key={i}>
                <FormControl display="flex" flexDir="column" isRequired>
                  <FormLabel>{question.question}</FormLabel>
                  <RadioGroup name={question.name} onChange={(value) => handleChange(value, question.name)}>
                    <Stack spacing={6} direction={{ base: "column", md: "row" }}>
                      {
                        question.options?.map((option) => {
                          return (
                            <Radio key={nanoid()} value={option.optionName}>
                              <Flex>
                                <option.icon size={24} style={{ color: option.color, marginRight: ".4rem" }} />
                                <span>{option.optionName}</span>
                              </Flex>
                            </Radio>
                          )
                        })
                      }
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </Card>
            )
          })
        }
        <Card p={4} mb={4}>
          <FormControl display="flex" flexDir="column" isRequired>
            <FormLabel>{"9) Is there anything else you'd like to share about your experience with us?"}</FormLabel>
            <Textarea
              name="additionalComments"
              placeholder="Your comments"
              onChange={(e) => handleChange(e.target.value, "additionalComments")}
            />
          </FormControl>
        </Card>
        <Button mt={4} colorScheme="blue" isLoading={isLoading} onClick={handleSubmit}>Submit Feedback</Button>
      </Flex>
    </Flex>
  );
}

export default Feedback;
