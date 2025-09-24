const registerUser = require("../models/User");

const createAccountRouter = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Account information could not be stored correctly",
      });
    }

    res.json({
      status: "success",
      message: "Account information has been registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = createAccountRouter;
