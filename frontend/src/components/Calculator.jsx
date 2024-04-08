import React, { useEffect, useState } from 'react'
import { Box, Heading, Select, Flex, Input, Button, Center, useToast, Container, Text } from '@chakra-ui/react'
import axios from 'axios';
import { nanoid } from 'nanoid'

const Calculator = () => {
  const API_URL = import.meta.env.VITE_API_URL
  const toast = useToast()
  const [materials, setMaterials] = useState([]);
  const [materialProperty, setMaterialProperty] = useState("");
  const [metal, setMetal] = useState("");
  const [nonMetal, setNonMetal] = useState("");
  const [resins, setResins] = useState("");
  const [ceramics, setCeramics] = useState("");

  const [answer, setAnswer] = useState(0);

  const renderMaterialOptions = (materialType) => {
    return materials?.map((material) => {
      return (
        material["Material Type"] === materialType &&
        <option key={nanoid()} value={material[materialProperty]}>{material["Material Name"]}</option>
      )
    })
  }

  useEffect(() => {
    axios.get(`${API_URL}/material/all-materials`)
      .then(response => {
        setMaterials(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);


  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = { percentage: 0 };
    const errors = [];
  
    // Define filterFloat function
    const filterFloat = function (value) {
      if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value))
        return Number(value);
      return 0; // Return NaN if the input is not a valid number
    };
  
    const processMaterial = (material) => {
      const volume = filterFloat(formData.get(`${material}-volume`));
      const percentage = parseInt(formData.get(`${material}-percentage`), 10);
      
      data[material] = filterFloat(formData.get(material));
      data[`${material}-volume`] = volume;
  
      if (volume > 0 && Number.isNaN(percentage)) {
        errors.push(`Percentage for ${material} is required when volume is provided.`);
      } else if (!Number.isNaN(percentage) && volume <= 0) {
        errors.push(`Volume for ${material} is required when percentage is provided.`);
      } else if (volume > 0 && !Number.isNaN(percentage)) {
        data.percentage += percentage;
      }
    };
  
    // Process each material type
    processMaterial('metal');
    processMaterial('non-metal');
    processMaterial('resins');
    processMaterial('ceramics');
  
    console.log(data);
  
    if (data.percentage !== 100) {
      toast({
        title: 'Percentage Error',
        description: "Total percentage should be equal to 100",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
  
    if (errors.length > 0) {
      toast({
        title: 'Input Error',
        description: errors.join("\n"),
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      return;
    }
  
    setAnswer((data.metal * data["metal-volume"]) + 
              (data["non-metal"] * data["non-metal-volume"]) + 
              (data.resins * data["resins-volume"]) + 
              (data.ceramics * data["ceramics-volume"]));
  };
  
  return (
    <Flex className='animate__animated animate__fadeIn' flexDir="column" alignItems="center">
      <Heading textAlign="center" color="blue.500">Combined Property Calculator</Heading>
      <Box mt={4} w={{ base: "100%", md: "500px" }} p={4}>
        <form onSubmit={submitHandler}>
          <Select placeholder='Select Material Property' name='materialProperty' value={materialProperty} onChange={(e) => setMaterialProperty(e.target.value)}>
            <option value='Elastic Modulus Values'>Elastic Modulus</option>
            <option value='Poissons Ratio Values'>Poissons Ratio</option>
            <option value='Shear Modulus Values'>Shear Modulus</option>
            <option value='Mass Density Values'>Mass Density</option>
            <option value='Yield Strength Values'>Yield Strength</option>
          </Select>

          <Flex gap={4} mt={4} direction={{ base: "column", md: "row" }}>
            <Select placeholder='Select Metal' name='metal' value={metal} onChange={(e) => setMetal(e.target.value)}>
              {renderMaterialOptions('Metals')}
            </Select>

            <Input placeholder='Enter Volume' name='metal-volume' />
            <Input placeholder='Enter Percentage' name='metal-percentage' />
          </Flex>

          <Flex gap={4} mt={4} direction={{ base: "column", md: "row" }}>
            <Select placeholder='Select Non-Metal' name='non-metal' value={nonMetal} onChange={(e) => setNonMetal(e.target.value)}>
              {renderMaterialOptions('Non-Metals')}
            </Select>

            <Input placeholder='Enter Volume' name='non-metal-volume' />
            <Input placeholder='Enter Percentage' name='non-metal-percentage' />
          </Flex>

          <Flex gap={4} mt={4} direction={{ base: "column", md: "row" }}>
            <Select placeholder='Select Resins' name='resins' value={resins} onChange={(e) => setResins(e.target.value)}>
              {renderMaterialOptions('Resins')}
            </Select>

            <Input placeholder='Enter Volume' name='resins-volume' />
            <Input placeholder='Enter Percentage' name='resins-percentage' />
          </Flex>

          <Flex gap={4} mt={4} direction={{ base: "column", md: "row" }}>
            <Select placeholder='Select Ceramics' name='ceramics' value={ceramics} onChange={(e) => setCeramics(e.target.value)}>
              {renderMaterialOptions('Ceramics')}
            </Select>

            <Input placeholder='Enter Volume' name='ceramics-volume' />
            <Input placeholder='Enter Percentage' name='ceramics-percentage' />
          </Flex>

          <Center mt={4}>
            <Button colorScheme='blue' type='submit'>Calculate</Button>
          </Center>
        </form>
      </Box>

      {
        answer !== 0 &&
        <Text mt={4} fontSize='3xl'> Answer: <Text as="span" fontWeight="bold">{answer}</Text> </Text>
      }
    </Flex>
  )
}

export default Calculator