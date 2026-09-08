import orderModel from "../../model/order.js";
import notificationModel from "../../model/notification.js";

const memoryOrders = [];

function newOrderId() {
  return "KW-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

function formatDate(date) {
  return date.toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

async function CreateOrder(req, res) {
  const {
    email,
    name,
    phone,
    address,
    city,
    postal,
    state,
    country,
    delivery,
    deliveryLabel,
    deliveryFee,
    payment,
    cardLast4,
    couponCode,
    items,
    subtotal,
    discount,
    total
  } = req.body;

  if (!email || !name || !address || !city || !postal || !items || !subtotal || total === undefined) {
    return res.status(400).json({ message: "Missing required order checkout fields" });
  }

  try {
    const id = req.body.id || newOrderId();
    const now = new Date();
    const formattedNow = formatDate(now);

    const initialEvents = [
      { label: "Order placed", date: formattedNow, note: "Order received" },
      { label: "Payment confirmed", date: formattedNow, note: `Paid via ${payment || "card"}` },
      { label: "Processing", date: formattedNow, note: "Being prepared at the atelier" }
    ];

    const etaDate = new Date(now.getTime() + (delivery === "express" ? 2 : 5) * 86400000);
    const etaFormatted = etaDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

    const orderData = {
      id,
      placedAt: now,
      email,
      name,
      phone,
      address,
      city,
      postal,
      state,
      country: country || "Nigeria",
      delivery: delivery || "standard",
      deliveryLabel: deliveryLabel || "Standard · 3–5 days",
      deliveryFee: deliveryFee || 0,
      payment: payment || "card",
      cardLast4,
      couponCode,
      items,
      subtotal,
      discount: discount || 0,
      total,
      status: "Processing",
      courier: delivery === "pickup" ? "Atelier pickup · Lagos" : "Pending assignment",
      tracking: "—",
      eta: etaFormatted,
      events: initialEvents
    };

    let newOrder;
    try {
      newOrder = await orderModel.create(orderData);
    } catch (dbErr) {
      newOrder = { _id: "ord-" + Date.now(), ...orderData };
    }
    memoryOrders.unshift(newOrder);

    try {
      await notificationModel.create({
        title: "New order received",
        desc: `Order ${id} placed by ${name} for ₦${total.toLocaleString()}`,
        type: "order"
      });
    } catch (err) {}

    return res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Order creation failed" });
  }
}

async function GetOrders(req, res) {
  try {
    const { status, search } = req.query;
    let orders = [];
    try {
      const filter = {};
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { id: { $regex: search, $options: "i" } },
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ];
      }
      orders = await orderModel.find(filter).sort({ createdAt: -1 });
    } catch (dbErr) {
      orders = memoryOrders;
      if (status) orders = orders.filter((o) => o.status === status);
      if (search) {
        const s = search.toLowerCase();
        orders = orders.filter(
          (o) =>
            o.id.toLowerCase().includes(s) ||
            o.name.toLowerCase().includes(s) ||
            o.email.toLowerCase().includes(s)
        );
      }
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
}

async function GetOrderById(req, res) {
  const { id } = req.params;
  try {
    let order;
    try {
      order = await orderModel.findOne({
        $or: [{ id: id.trim().toUpperCase() }, { id: id.trim() }]
      });
    } catch (dbErr) {}

    if (!order) {
      order = memoryOrders.find(
        (o) => o.id.toLowerCase() === id.trim().toLowerCase() || String(o._id) === id.trim()
      );
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Order lookup failed" });
  }
}

async function TrackOrder(req, res) {
  const { id } = req.params;
  try {
    let order;
    try {
      order = await orderModel.findOne({ id: new RegExp(`^${id.trim()}$`, "i") });
    } catch (dbErr) {}

    if (!order) {
      order = memoryOrders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
    }

    if (!order) {
      return res.status(404).json({ message: "We couldn't find that order number. Check it and try again." });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Tracking lookup failed" });
  }
}

async function UpdateOrderStatus(req, res) {
  const { id } = req.params;
  const { status, courier, tracking, eta } = req.body;

  try {
    let order;
    try {
      order = await orderModel.findOne({
        $or: [{ id: id.trim() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
    } catch (dbErr) {}

    if (!order) {
      order = memoryOrders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status && status !== order.status) {
      const nowFormatted = formatDate(new Date());
      order.events.push({
        label: status,
        date: nowFormatted,
        note: `Status updated to ${status}`
      });
    }

    if (status) order.status = status;
    if (courier) order.courier = courier;
    if (tracking) order.tracking = tracking;
    if (eta) order.eta = eta;

    try {
      await orderModel.findByIdAndUpdate(order._id, order, { new: true });
    } catch (err) {}

    return res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update order status" });
  }
}

async function RequestDeliveryChange(req, res) {
  const { id } = req.params;
  const { preferredDate, instructions } = req.body;

  try {
    let order;
    try {
      order = await orderModel.findOne({
        $or: [{ id: id.trim() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
    } catch (dbErr) {}

    if (!order) {
      order = memoryOrders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase());
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.deliveryChangeRequest = {
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      instructions,
      requestedAt: new Date()
    };

    try {
      await order.save();
    } catch (err) {}

    return res.status(200).json({ message: "Delivery change requested successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to submit delivery change request" });
  }
}

async function DeleteOrders(req, res) {
  const { ids } = req.body;
  try {
    try {
      if (Array.isArray(ids)) {
        await orderModel.deleteMany({ $or: [{ id: { $in: ids } }, { _id: { $in: ids } }] });
      } else if (req.params.id) {
        await orderModel.findByIdAndDelete(req.params.id);
      }
    } catch (err) {}
    return res.status(200).json({ message: "Order(s) deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete order(s)" });
  }
}

export {
  CreateOrder,
  GetOrders,
  GetOrderById,
  TrackOrder,
  UpdateOrderStatus,
  RequestDeliveryChange,
  DeleteOrders
};
