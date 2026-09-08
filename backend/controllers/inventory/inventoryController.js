import productModel from "../../model/product.js";
import stockMovementModel from "../../model/stockMovement.js";
import notificationModel from "../../model/notification.js";

const memoryMovements = [
  { _id: "mov-1", product: "Monogram Heavy Hoodie", change: 10, reason: "Restock", date: new Date().toISOString().slice(0, 10) },
  { _id: "mov-2", product: "Gold Emblem Cap", change: -2, reason: "Customer Order KW-4X21K", date: new Date().toISOString().slice(0, 10) }
];

async function GetInventory(req, res) {
  try {
    let products = [];
    let movements = [];
    try {
      products = await productModel.find().select("name category stock inStock status images price");
      movements = await stockMovementModel.find().sort({ createdAt: -1 }).limit(50);
    } catch (dbErr) {}

    if (movements.length === 0) movements = memoryMovements;
    return res.status(200).json({ products, movements });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch inventory data" });
  }
}

async function AdjustStock(req, res) {
  const { productId, change, reason } = req.body;
  if (!productId || change === undefined || !reason) {
    return res.status(400).json({ message: "productId, stock change (+/-), and reason are required" });
  }

  try {
    let product;
    try {
      product = await productModel.findById(productId);
      if (product) {
        const newStock = Math.max(0, product.stock + Number(change));
        product.stock = newStock;
        product.inStock = newStock > 0;
        await product.save();
      }
    } catch (dbErr) {}

    const todayStr = new Date().toISOString().slice(0, 10);
    const movement = {
      _id: "MOV-" + Date.now(),
      product: product ? product.name : productId,
      change: Number(change),
      reason,
      date: todayStr
    };
    try {
      await stockMovementModel.create(movement);
    } catch (dbErr) {}
    memoryMovements.unshift(movement);

    try {
      await notificationModel.create({
        title: "Stock adjustment",
        desc: `Stock adjusted for ${product ? product.name : productId} (${change > 0 ? '+' : ''}${change})`,
        type: "stock"
      });
    } catch (err) {}

    return res.status(200).json({ message: "Stock level adjusted", product: product || { id: productId, stockChange: change }, movement });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Stock adjustment failed" });
  }
}

async function GetStockMovements(req, res) {
  try {
    let movements = [];
    try {
      movements = await stockMovementModel.find().sort({ createdAt: -1 });
    } catch (dbErr) {}
    if (movements.length === 0) movements = memoryMovements;
    return res.status(200).json(movements);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch stock movements" });
  }
}

export { GetInventory, AdjustStock, GetStockMovements };
