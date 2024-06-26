import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
  Box,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Checkbox,
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const handleClick = () => setShow(!show);

  const { toggleColorMode } = useColorMode();
  const formBg = useColorModeValue("white", "gray.700");
  const formColor = useColorModeValue("gray.800", "white");
  const inputBg = useColorModeValue("gray.100", "gray.600");
  const buttonBg = useColorModeValue("blue.400", "blue.600");
  const buttonHoverBg = useColorModeValue("blue.500", "blue.700");

  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: passwordRef.current.value,
      activities: selectedActivities,
      location: coordinates, // Include coordinates in the form data
    };

    const newErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character.";
    }
    if (formData.activities.length === 0 || formData.activities.length > 3) {
      newErrors.activities = "You must select between 1 and 3 activities.";
    }
    if (!formData.location.lat || !formData.location.lng) {
      newErrors.location = "Location is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const result = await response.json();
      console.log("API response:", result);
      if (result.status === 201) {
        navigate("/home");
      }
      // Handle the response as needed
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle the error as needed
    }
  };

  const handleActivityChange = (selected) => {
    if (selected.length <= 3) {
      setSelectedActivities(selected);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg={useColorModeValue("gray.50", "gray.900")}
      p={4}
    >
      <Button
        position="absolute"
        top={4}
        right={4}
        onClick={toggleColorMode}
        bg={buttonBg}
        color="white"
        _hover={{ bg: buttonHoverBg }}
      >
        {useColorModeValue(<FaMoon />, <FaSun />)}
      </Button>
      <Box
        as="form"
        onSubmit={handleSubmit}
        w="full"
        maxW="md"
        p={6}
        boxShadow="2xl"
        borderRadius="lg"
        bg={formBg}
        color={formColor}
      >
        <VStack spacing={4}>
          <Heading as="h2" size="xl" color={buttonBg}>
            Sign Up
          </Heading>
          <Text color="gray.500">
            Create an account by filling out the form below.
          </Text>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input
              ref={nameRef}
              type="text"
              placeholder="Enter your Name"
              boxShadow="md"
              borderRadius="md"
              focusBorderColor="blue.400"
              bg={inputBg}
            />
          </FormControl>
          <FormControl id="email" isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              ref={emailRef}
              type="email"
              placeholder="abc@gmail.com"
              boxShadow="md"
              borderRadius="md"
              focusBorderColor="blue.400"
              bg={inputBg}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl id="phone">
            <FormLabel>Phone Number</FormLabel>
            <Input
              ref={phoneRef}
              type="tel"
              placeholder="phone number"
              boxShadow="md"
              borderRadius="md"
              focusBorderColor="blue.400"
              bg={inputBg}
            />
          </FormControl>
          <FormControl id="password" isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                ref={passwordRef}
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                boxShadow="md"
                borderRadius="md"
                focusBorderColor="blue.400"
                bg={inputBg}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={handleClick}
                  bg={buttonBg}
                  color="white"
                  _hover={{ bg: buttonHoverBg }}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <FormControl id="activities" isInvalid={errors.activities}>
            <FormLabel>Activities of Interest (Select up to 3)</FormLabel>
            <CheckboxGroup
              value={selectedActivities}
              onChange={handleActivityChange}
            >
              <Stack direction="column">
                <Checkbox value="Swimming">Swimming</Checkbox>
                <Checkbox value="Hiking">Hiking</Checkbox>
                <Checkbox value="Cricket">Cricket</Checkbox>
                <Checkbox value="Hockey">Hockey</Checkbox>
                <Checkbox value="Football">Football</Checkbox>
              </Stack>
            </CheckboxGroup>
            <FormErrorMessage>{errors.activities}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            bg={buttonBg}
            color="white"
            width="full"
            mt={4}
            _hover={{ bg: buttonHoverBg }}
          >
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Signup;
