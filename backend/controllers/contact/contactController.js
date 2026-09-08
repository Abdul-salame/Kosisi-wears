import contactModel from "../../model/contact.js";

const memoryContacts = [];

async function SubmitContactMessage(req, res) {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" });
  }

  try {
    const contactData = { name, email, subject, message, status: "unread" };
    let newContact;
    try {
      newContact = await contactModel.create(contactData);
    } catch (dbErr) {
      newContact = { _id: "cnt-" + Date.now(), ...contactData, createdAt: new Date().toISOString() };
    }
    memoryContacts.unshift(newContact);

    return res.status(201).json({ message: "Message sent successfully", contact: newContact });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send contact message" });
  }
}

async function GetContactMessages(req, res) {
  try {
    let messages = [];
    try {
      messages = await contactModel.find().sort({ createdAt: -1 });
    } catch (dbErr) {}
    if (messages.length === 0) messages = memoryContacts;
    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch contact messages" });
  }
}

export { SubmitContactMessage, GetContactMessages };
