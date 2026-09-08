import notificationModel from "../../model/notification.js";

const memoryNotifications = [
  { _id: "n-1", title: "New order received", desc: "Order KW-4X21K placed by Ada Obi", type: "order", time: "10 mins ago", read: false },
  { _id: "n-2", title: "Low stock alert", desc: "Monogram Heavy Hoodie has 2 units left", type: "stock", time: "1 hour ago", read: false },
  { _id: "n-3", title: "New review received", desc: "David K. left a 5★ review", type: "review", time: "2 hours ago", read: true }
];

async function GetNotifications(req, res) {
  try {
    let notifications = [];
    try {
      notifications = await notificationModel.find().sort({ createdAt: -1 });
    } catch (dbErr) {}
    if (notifications.length === 0) notifications = memoryNotifications;

    const unreadCount = notifications.filter((n) => !n.read).length;
    return res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
}

async function MarkNotificationRead(req, res) {
  const { id } = req.params;
  try {
    let updated;
    try {
      updated = await notificationModel.findByIdAndUpdate(id, { read: true }, { new: true });
    } catch (dbErr) {}

    if (!updated) {
      const item = memoryNotifications.find((n) => String(n._id) === id || n.id === id);
      if (item) {
        item.read = true;
        updated = item;
      }
    }

    if (!updated) return res.status(404).json({ message: "Notification not found" });
    return res.status(200).json({ message: "Notification marked read", notification: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to mark notification as read" });
  }
}

async function MarkAllNotificationsRead(req, res) {
  try {
    try {
      await notificationModel.updateMany({}, { read: true });
    } catch (dbErr) {}
    memoryNotifications.forEach((n) => (n.read = true));
    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to mark notifications read" });
  }
}

export { GetNotifications, MarkNotificationRead, MarkAllNotificationsRead };
