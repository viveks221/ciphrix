import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  TagLabel,
  Spinner,
  Flex,
  Button,
} from "@chakra-ui/react";

const NearbyFriends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchNearbyFriends = async (lat, lng) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/nearby-friends",
          {
            body: { lat, lng },
          },
          { withCredentials: true }
        );
        setFriends(response?.data?.nearbyFriends);
      } catch (error) {
        console.error("Error fetching nearby friends:", error);
        setError("Failed to fetch nearby friends.");
      } finally {
        setLoading(false);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchNearbyFriends(latitude, longitude);
          },
          (error) => {
            console.error("Error getting user location:", error);
            setError(
              "Unable to retrieve your location. Please enable location services and try again."
            );
            setLoading(false);
          }
        );
      }
    };

    getUserLocation();
  }, []);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="60vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={5} textAlign="center">
        <Text color="red.500" mb={4}>
          {error}
        </Text>
        <Button onClick={() => window.location.reload()} colorScheme="teal">
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={5} color="teal.500">
        Nearby Friends
      </Heading>
      <VStack spacing={5}>
        {friends.map(({ user, distance }) => (
          <Box
            key={user?.id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            width="100%"
            maxW="600px"
          >
            <Heading fontSize="xl" color="teal.700">
              {name}
            </Heading>
            <Text mt={2} color="gray.600">
              Email: {user?.email}
            </Text>
            <Text mt={2} color="gray.600">
              Phone: {user?.phone}
            </Text>
            <HStack mt={3}>
              {user.activities.map((activity) => (
                <Tag
                  size="md"
                  key={activity}
                  variant="solid"
                  colorScheme="teal"
                >
                  <TagLabel>{activity}</TagLabel>
                </Tag>
              ))}
            </HStack>
            <Text mt={3} fontWeight="bold" color="teal.600">
              Distance: {(distance / 1000).toFixed(2)} km
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default NearbyFriends;
