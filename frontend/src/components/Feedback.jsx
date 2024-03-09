import { useState } from "react";
import {
  Flex,
  Heading,
  Button,
  Stack,
  Box,
  FormControl,
  Textarea
} from "@chakra-ui/react";


const Feedback = () => {

    const [feedback, setFeedback] = useState("")
    const handleSubmit = (e)=>{
        e.preventDefault()
        console.log(feedback)
    }

  return (
    <Flex
      flexDirection="column"
      width="100vw"
      // height="100vh"
      justifyContent="center"
      alignItems="center"
      marginTop={16}
      className="animate__animated animate__fadeIn"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="blue.400">Feedback</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl isRequired>
              <Textarea resize="none" value={feedback} onChange={(e)=>setFeedback(e.target.value)} placeholder='Write your feedback here' />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                
              >
                Submit Feedback
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Feedback;
