const { createMessage, modifyMessage } = require("../models/messages");

const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const newMessage = await createMessage(chatId, userId, message);

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }
};

const editMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, messageId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const newMessage = await modifyMessage(chatId, userId, messageId, message);

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error modifying message:", error);
    return res.status(500).json({ error: "Failed to modify message" });
  }
};

module.exports = { sendMessage, editMessage };
