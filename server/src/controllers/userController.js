// controllers/userController.js
const { searchUsers } = require("../models/searchUsers");

const searchUsersController = async (req, res) => {
  try {
    const { q: query } = req.query;

    // Validate query parameter
    if (!query || query.trim() === "") {
      console.log("❌ Empty query provided");
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Optional: Add authentication check
    // if (!req.user) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Authentication required",
    //   });
    // }

    const users = await searchUsers(query.trim());

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching users",
    });
  }
};

module.exports = { searchUsersController };
