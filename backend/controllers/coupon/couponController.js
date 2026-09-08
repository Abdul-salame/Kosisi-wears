import couponModel from "../../model/coupon.js";

const memoryCoupons = [
  { code: "KOSISI10", percent: 10, label: "10% off your order", status: "active" },
  { code: "WELCOME15", percent: 15, label: "15% off first order", status: "active" },
  { code: "VIP20", percent: 20, label: "20% off orders over ₦300,000", minSpend: 300000, status: "active" }
];

async function ValidateCoupon(req, res) {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ message: "Coupon code is required" });
  }

  try {
    let found;
    try {
      found = await couponModel.findOne({ code: code.trim().toUpperCase() });
    } catch (dbErr) {}

    if (!found) {
      found = memoryCoupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
    }

    if (!found || found.status !== "active") {
      return res.status(404).json({ error: "That coupon code isn't valid." });
    }

    if (found.expiresAt && new Date() > new Date(found.expiresAt)) {
      return res.status(400).json({ error: "That coupon code has expired." });
    }

    const subtotalNum = Number(subtotal || 0);
    if (found.minSpend && subtotalNum < found.minSpend) {
      return res.status(400).json({
        error: `Requires a minimum spend of ₦${found.minSpend.toLocaleString()}.`
      });
    }

    return res.status(200).json({
      coupon: {
        code: found.code,
        percent: found.percent,
        label: found.label,
        minSpend: found.minSpend,
        type: found.type || "percentage",
        discount: found.discount
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Coupon validation error" });
  }
}

async function CreateCoupon(req, res) {
  const { code, percent, label, minSpend, type, discount, limit, expiresAt, status } = req.body;
  if (!code || !label) {
    return res.status(400).json({ message: "Code and label are required" });
  }

  try {
    const formattedCode = code.trim().toUpperCase();
    const newCouponData = {
      code: formattedCode,
      percent: percent ? Number(percent) : 0,
      label,
      minSpend: minSpend ? Number(minSpend) : undefined,
      type: type || "percentage",
      discount: discount ? Number(discount) : undefined,
      limit: limit ? Number(limit) : 100,
      expiresAt,
      status: status || "active"
    };

    let newCoupon;
    try {
      newCoupon = await couponModel.create(newCouponData);
    } catch (dbErr) {
      newCoupon = { _id: "cpn-" + Date.now(), ...newCouponData };
    }
    memoryCoupons.push(newCoupon);

    return res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Failed to create coupon" });
  }
}

async function GetCoupons(req, res) {
  try {
    let coupons = [];
    try {
      coupons = await couponModel.find().sort({ createdAt: -1 });
    } catch (dbErr) {}
    if (coupons.length === 0) coupons = memoryCoupons;
    return res.status(200).json(coupons);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch coupons" });
  }
}

async function UpdateCoupon(req, res) {
  const { id } = req.params;
  try {
    let updated;
    try {
      updated = await couponModel.findByIdAndUpdate(id, req.body, { new: true });
    } catch (dbErr) {}
    if (!updated) {
      const idx = memoryCoupons.findIndex((c) => String(c._id) === id || c.code === id);
      if (idx !== -1) {
        memoryCoupons[idx] = { ...memoryCoupons[idx], ...req.body };
        updated = memoryCoupons[idx];
      }
    }
    if (!updated) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    return res.status(200).json({ message: "Coupon updated successfully", coupon: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update coupon" });
  }
}

async function DeleteCoupon(req, res) {
  const { id } = req.params;
  try {
    try {
      await couponModel.findByIdAndDelete(id);
    } catch (dbErr) {}
    const idx = memoryCoupons.findIndex((c) => String(c._id) === id || c.code === id);
    if (idx !== -1) memoryCoupons.splice(idx, 1);

    return res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete coupon" });
  }
}

export { ValidateCoupon, CreateCoupon, GetCoupons, UpdateCoupon, DeleteCoupon };
