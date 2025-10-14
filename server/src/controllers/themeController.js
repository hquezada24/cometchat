const { fetchTheme, switchTheme } = require("../models/theme");

const themeController = async (req, res) => {
  const userId = req.user?.id;

  console.log("User: ", userId);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // search email in the db
    const theme = await fetchTheme(userId);
    console.log("theme: ", theme);

    // email found
    return res.status(200).json(theme);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Failed to fetch user theme" });
  }
};

const updateThemeController = async (req, res) => {
  const userId = req.user?.id;
  const { newTheme } = req.body;

  console.log("User: ", userId);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // search email in the db
    const theme = await switchTheme(userId, newTheme);
    console.log("theme: ", theme);

    // email found
    return res.status(200).json(theme);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Failed to update user theme" });
  }
};

module.exports = { themeController, updateThemeController };
