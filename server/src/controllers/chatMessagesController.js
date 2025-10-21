const {
  createMessage,
  modifyMessage,
  removeMessage,
} = require("../models/messages");

const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const userId = req.user?.id;

    console.log(message);
    console.log(userId);

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

const deleteMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { messageId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!messageId) {
      return res.status(400).json({ error: "No Message id was provided" });
    }

    const result = await removeMessage(chatId, userId, messageId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error modifying message:", error);
    return res.status(500).json({ error: "Failed to modify message" });
  }
};

module.exports = { sendMessage, editMessage, deleteMessage };
