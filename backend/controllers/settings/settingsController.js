import settingsModel from "../../model/settings.js";

let memorySettings = {
  storeName: "Kosisi Wears",
  supportEmail: "support@kosisi.co",
  description: "Luxury sportswear crafted in limited runs.",
  currency: "NGN",
  timezone: "Africa/Lagos",
  payments: { Paystack: true, Stripe: false, "Bank transfer": true },
  shipping: { standard: "₦15,000", freeOver: "₦250,000", express: "₦35,000", processing: "2-3 business days" },
  social: { Instagram: "", TikTok: "", Twitter: "", YouTube: "" },
  notifications: {
    "New orders": true,
    "Low stock alerts": true,
    "New reviews": true,
    "Coupon expirations": false,
    "Weekly summary": true
  }
};

async function GetSettings(req, res) {
  try {
    let settings;
    try {
      settings = await settingsModel.findOne();
      if (!settings) {
        settings = await settingsModel.create(memorySettings);
      }
    } catch (dbErr) {}

    if (!settings) settings = memorySettings;
    return res.status(200).json(settings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch store settings" });
  }
}

async function UpdateSettings(req, res) {
  try {
    let settings;
    try {
      settings = await settingsModel.findOne();
      if (!settings) {
        settings = await settingsModel.create(req.body);
      } else {
        settings = await settingsModel.findByIdAndUpdate(settings._id, req.body, { new: true });
      }
    } catch (dbErr) {}

    memorySettings = { ...memorySettings, ...req.body };
    if (!settings) settings = memorySettings;

    return res.status(200).json({ message: "Settings saved successfully", settings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update settings" });
  }
}

export { GetSettings, UpdateSettings };
