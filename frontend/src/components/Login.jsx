import { useState, useRef } from "react";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();

  const { toggleColorMode } = useColorMode();
  const formBg = useColorModeValue("white", "gray.700");
  const formColor = useColorModeValue("gray.800", "white");
  const inputBg = useColorModeValue("gray.100", "gray.600");
  const buttonBg = useColorModeValue("blue.400", "blue.600");
  const buttonHoverBg = useColorModeValue("blue.500", "blue.700");

  const emailRef = useRef();
  const passwordRef = useRef();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    const newErrors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const result = await response.json();

      if (result.message === "Login successful") {
        navigate("/home");
      } else {
        setErrors({ server: "Login failed" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ server: "Error submitting form" });
    } finally {
      setLoading(false);
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
      ></Button>
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
            Login
          </Heading>
          <Text color="gray.500">Access your account by logging in.</Text>
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
          <FormControl id="password">
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
          </FormControl>
          {errors.server && (
            <Text color="red.500" fontSize="sm">
              {errors.server}
            </Text>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            bg={buttonBg}
            color="white"
            width="full"
            mt={4}
            _hover={{ bg: buttonHoverBg }}
            isLoading={loading}
          >
            Login
          </Button>
          <Text color="blue.500" mt={4}>
            New user?{" "}
            <Button
              variant="link"
              color="blue.500"
              onClick={() => navigate("/signup")}
            >
              Click here to signup
            </Button>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
