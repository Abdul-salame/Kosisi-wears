import stream from "stream";
import multer from "multer";
import customOrderModel from "../../model/customOrder.js";
import notificationModel from "../../model/notification.js";
import cloudinary from "../../config/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });
const memoryCustomOrders = [];

function uploadToCloudinary(buffer, folder, resourceType = "auto") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    const readable = new stream.PassThrough();
    readable.end(buffer);
    readable.pipe(uploadStream);
  });
}

function newCustomOrderId() {
  return "CR-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

async function CreateCustomOrder(req, res) {
  const {
    itemType,
    styleReference,
    colors,
    teamOrClubName,
    playerNamesNumbers,
    notes,
    name,
    email,
    phone
  } = req.body;

  if (!name || !email || !colors) {
    return res.status(400).json({ message: "Name, email, and colors are required for custom orders" });
  }

  try {
    let uploadedImage;
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, "kosisi/custom-orders", "image");
        if (result?.secure_url) uploadedImage = result.secure_url;
      } catch (err) {}
    } else if (req.body.referenceImage && req.body.referenceImage.startsWith("data:image")) {
      try {
        const result = await cloudinary.uploader.upload(req.body.referenceImage, {
          folder: "kosisi/custom-orders",
          resource_type: "image"
        });
        if (result?.secure_url) uploadedImage = result.secure_url;
      } catch (err) {}
    } else if (req.body.referenceImage) {
      uploadedImage = req.body.referenceImage;
    }

    const id = req.body.id || newCustomOrderId();
    const reqData = {
      id,
      itemType: itemType || "Jersey",
      styleReference,
      colors,
      teamOrClubName,
      playerNamesNumbers,
      notes,
      referenceImage: uploadedImage,
      name,
      email,
      phone,
      status: "New"
    };

    let newRequest;
    try {
      newRequest = await customOrderModel.create(reqData);
    } catch (dbErr) {
      newRequest = { _id: "cr-" + Date.now(), ...reqData };
    }
    memoryCustomOrders.unshift(newRequest);

    try {
      await notificationModel.create({
        title: "New custom order request",
        desc: `${name} requested a custom ${(itemType || "jersey").toLowerCase()} (${id})`,
        type: "custom"
      });
    } catch (err) {}

    return res.status(201).json({ message: "Custom order request submitted successfully", request: newRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Failed to submit custom order request" });
  }
}

async function GetCustomOrders(req, res) {
  try {
    const { status } = req.query;
    let requests = [];
    try {
      const filter = {};
      if (status) filter.status = status;
      requests = await customOrderModel.find(filter).sort({ createdAt: -1 });
    } catch (dbErr) {
      requests = memoryCustomOrders;
      if (status) requests = requests.filter((r) => r.status === status);
    }
    return res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch custom order requests" });
  }
}

async function GetCustomOrderById(req, res) {
  const { id } = req.params;
  try {
    let request;
    try {
      request = await customOrderModel.findOne({
        $or: [{ id: id.trim().toUpperCase() }, { id: id.trim() }]
      });
    } catch (dbErr) {}

    if (!request) {
      request = memoryCustomOrders.find(
        (r) => r.id.toLowerCase() === id.trim().toLowerCase() || String(r._id) === id.trim()
      );
    }

    if (!request) {
      return res.status(404).json({ message: "Custom order request not found" });
    }
    return res.status(200).json(request);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lookup failed" });
  }
}

async function UpdateCustomOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    let updated;
    try {
      updated = await customOrderModel.findOneAndUpdate(
        { $or: [{ id: id.trim() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { status },
        { new: true }
      );
    } catch (dbErr) {}

    if (!updated) {
      const item = memoryCustomOrders.find((r) => r.id.toLowerCase() === id.trim().toLowerCase() || String(r._id) === id.trim());
      if (item) {
        item.status = status;
        updated = item;
      }
    }

    if (!updated) {
      return res.status(404).json({ message: "Custom order request not found" });
    }
    return res.status(200).json({ message: "Custom order status updated", request: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update custom order status" });
  }
}

async function UpdateCustomOrderQuote(req, res) {
  const { id } = req.params;
  const { quotedPrice } = req.body;
  try {
    let updated;
    try {
      updated = await customOrderModel.findOneAndUpdate(
        { $or: [{ id: id.trim() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
        { quotedPrice: Number(quotedPrice), status: "Quoted" },
        { new: true }
      );
    } catch (dbErr) {}

    if (!updated) {
      const item = memoryCustomOrders.find((r) => r.id.toLowerCase() === id.trim().toLowerCase() || String(r._id) === id.trim());
      if (item) {
        item.quotedPrice = Number(quotedPrice);
        item.status = "Quoted";
        updated = item;
      }
    }

    if (!updated) {
      return res.status(404).json({ message: "Custom order request not found" });
    }
    return res.status(200).json({ message: "Quote price updated", request: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update quote price" });
  }
}

async function DeleteCustomOrders(req, res) {
  const { ids } = req.body;
  try {
    try {
      if (Array.isArray(ids)) {
        await customOrderModel.deleteMany({ $or: [{ id: { $in: ids } }, { _id: { $in: ids } }] });
      } else if (req.params.id) {
        await customOrderModel.findByIdAndDelete(req.params.id);
      }
    } catch (err) {}
    return res.status(200).json({ message: "Custom order request(s) deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Deletion failed" });
  }
}

export {
  CreateCustomOrder,
  GetCustomOrders,
  GetCustomOrderById,
  UpdateCustomOrderStatus,
  UpdateCustomOrderQuote,
  DeleteCustomOrders,
  upload
};
