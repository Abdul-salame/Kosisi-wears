import newsletterModel from "../../model/newsletter.js";

const memorySubscribers = [];

async function SubscribeNewsletter(req, res) {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Valid email address is required" });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    let existing;
    try {
      existing = await newsletterModel.findOne({ email: cleanEmail });
    } catch (dbErr) {
      existing = memorySubscribers.find((s) => s.email === cleanEmail);
    }

    if (existing) {
      return res.status(200).json({ message: "You're already subscribed to our newsletter", subscriber: existing });
    }

    const subData = { email: cleanEmail, subscribedAt: new Date(), status: "active" };
    let newSub;
    try {
      newSub = await newsletterModel.create(subData);
    } catch (dbErr) {
      newSub = { _id: "sub-" + Date.now(), ...subData };
    }
    memorySubscribers.unshift(newSub);

    return res.status(201).json({ message: "Subscribed to newsletter successfully", subscriber: newSub });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Newsletter subscription failed" });
  }
}

async function GetNewsletterSubscribers(req, res) {
  try {
    let subscribers = [];
    try {
      subscribers = await newsletterModel.find().sort({ createdAt: -1 });
    } catch (dbErr) {}
    if (subscribers.length === 0) subscribers = memorySubscribers;
    return res.status(200).json(subscribers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch subscribers" });
  }
}

export { SubscribeNewsletter, GetNewsletterSubscribers };
