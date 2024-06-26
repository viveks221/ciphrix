const axios = require("axios");
const { Op, fn, col, where } = require("sequelize");
const User = require("../models/User");

const getNearbyFriends = async (req, res) => {
  const userId = req.session.userId;
  const { lat, lng } = req.body.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Fetch user and their activities
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { activities } = user;

    // Construct the JSON_CONTAINS conditions for each activity
    const jsonContainsConditions = activities.map((activity) =>
      where(fn("JSON_CONTAINS", col("activities"), JSON.stringify(activity)), 1)
    );
    console.log(jsonContainsConditions, "conditons");
    // Find users with specified activities and exclude current user
    const nearbyUsers = await User.findAll({
      where: {
        id: {
          [Op.ne]: userId,
        },
        [Op.or]: jsonContainsConditions,
        location: {
          [Op.ne]: null,
        },
      },
      attributes: { exclude: ["password"] },
    });

    if (!nearbyUsers.length) {
      return res.json({
        nearbyFriends: [],
      });
    }

    // Construct origin and destination strings for the Distance Matrix API
    const origins = `${lat},${lng}`;
    const destinations = nearbyUsers
      .map((user) => user.location.coordinates.join(","))
      .join("|");
    console.log(destinations, "destinations");
    // Fetch distances from Distance Matrix API
    const apiKey = process.env.MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

    const response = await axios.get(url);
    if (
      !response.data.rows ||
      !response.data.rows[0] ||
      !response.data.rows[0].elements
    ) {
      console.error("Invalid response from Distance Matrix API");
      return res.status(500).json({ message: "Error fetching distances" });
    }
    const distances = response.data.rows[0].elements;

    // Process users with distances and filter by common activities
    const nearbyFriends = nearbyUsers
      .map((nearbyUser, index) => {
        const distanceElement = distances[index];
        const distance = distanceElement.distance.value;
        return {
          user: nearbyUser,
          distance,
        };
      })
      .sort((a, b) => a.distance - b.distance);
    res.json({
      nearbyFriends,
    });
  } catch (error) {
    console.error("Error fetching nearby friends:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { getNearbyFriends };
