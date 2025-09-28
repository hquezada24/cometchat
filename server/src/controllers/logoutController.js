const logoutController = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      path: "/", // Make sure path matches the one used when setting the cookie
    });

    // Optional: If using refresh tokens, clear that cookie too
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Optional: Add any server-side session cleanup here
    // For example, if storing sessions in database or Redis:
    // await sessionStore.destroy(req.sessionId);

    // Optional: If maintaining a blacklist of tokens, add current token to it
    // const token = req.cookies.authToken;
    // if (token) {
    //   await addToTokenBlacklist(token);
    // }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
};

module.exports = logoutController;
