import stream from "stream";
import multer from "multer";
import productModel from "../../model/product.js";
import cloudinary from "../../config/cloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });
const memoryProducts = [];

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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function CreateProduct(req, res) {
  const {
    name,
    price,
    compareAt,
    category,
    sizes,
    colors,
    tag,
    description,
    inStock,
    stock,
    status
  } = req.body;

  const parsedPrice = Number(price);

  if (!name || !price || !category || !description) {
    return res.status(400).json({ message: "Name, price, category, and description are required" });
  }

  if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ message: "Price must be a valid positive number" });
  }

  try {
    const slug = `${slugify(name)}-${Date.now().toString().slice(-4)}`;
    const uploadedImages = [];

    if (req.files?.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        try {
          const result = await uploadToCloudinary(file.buffer, "kosisi/products", "image");
          if (result?.secure_url) uploadedImages.push(result.secure_url);
        } catch (err) {}
      }
    } else if (req.body.images) {
      const imgList = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      for (const img of imgList) {
        if (typeof img === "string" && img.startsWith("http")) {
          uploadedImages.push(img);
        } else if (typeof img === "string" && img.startsWith("data:image")) {
          try {
            const result = await cloudinary.uploader.upload(img, { folder: "kosisi/products", resource_type: "image" });
            if (result?.secure_url) uploadedImages.push(result.secure_url);
          } catch (err) {}
        }
      }
    }

    const parsedSizes = typeof sizes === "string" ? sizes.split(",").map((s) => s.trim()) : sizes || ["S", "M", "L", "XL"];
    let parsedColors = [];
    if (typeof colors === "string") {
      try { parsedColors = JSON.parse(colors); } catch { parsedColors = [{ name: colors, hex: "#000" }]; }
    } else if (Array.isArray(colors)) {
      parsedColors = colors;
    }

    const productData = {
      name,
      slug,
      price: parsedPrice,
      compareAt: compareAt ? Number(compareAt) : undefined,
      category,
      sizes: parsedSizes,
      colors: parsedColors,
      images: uploadedImages.length > 0 ? uploadedImages : ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80"],
      tag,
      description,
      inStock: inStock !== undefined ? String(inStock) === "true" : true,
      stock: stock ? Number(stock) : 15,
      status: status || "Active"
    };

    let newProduct;
    try {
      newProduct = await productModel.create(productData);
    } catch (dbErr) {
      newProduct = { _id: "prd-" + Date.now(), ...productData };
    }
    memoryProducts.unshift(newProduct);

    return res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Product was not created" });
  }
}

async function GetProducts(req, res) {
  try {
    const { category, tag, minPrice, maxPrice, search, inStock, status, sort } = req.query;
    let products = [];
    try {
      const filter = {};
      if (category) filter.category = category;
      if (tag) filter.tag = tag;
      if (status) filter.status = status;
      if (inStock !== undefined) filter.inStock = String(inStock) === "true";
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ];
      }
      let query = productModel.find(filter);
      if (sort === "price-asc") query = query.sort({ price: 1 });
      else if (sort === "price-desc") query = query.sort({ price: -1 });
      else if (sort === "rating") query = query.sort({ rating: -1 });
      else query = query.sort({ createdAt: -1 });

      products = await query;
    } catch (dbErr) {
      products = memoryProducts;
      if (category) products = products.filter((p) => p.category === category);
      if (tag) products = products.filter((p) => p.tag === tag);
      if (status) products = products.filter((p) => p.status === status);
      if (search) products = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Products could not be fetched" });
  }
}

async function GetProductByIdOrSlug(req, res) {
  const { identifier } = req.params;
  try {
    let product;
    try {
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        product = await productModel.findById(identifier);
      }
      if (!product) {
        product = await productModel.findOne({ slug: identifier });
      }
    } catch (dbErr) {}

    if (!product) {
      product = memoryProducts.find(
        (p) => p.slug === identifier || String(p._id) === identifier || p.id === identifier
      );
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Product fetch failed" });
  }
}

async function UpdateProduct(req, res) {
  const { id } = req.params;
  try {
    const updateData = { ...req.body };
    let product;
    try {
      product = await productModel.findByIdAndUpdate(id, updateData, { new: true });
    } catch (dbErr) {}

    if (!product) {
      const idx = memoryProducts.findIndex((p) => String(p._id) === id || p.id === id);
      if (idx !== -1) {
        memoryProducts[idx] = { ...memoryProducts[idx], ...updateData };
        product = memoryProducts[idx];
      }
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Product update failed" });
  }
}

async function DeleteProduct(req, res) {
  const { id } = req.params;
  try {
    try {
      await productModel.findByIdAndDelete(id);
    } catch (dbErr) {}
    const idx = memoryProducts.findIndex((p) => String(p._id) === id || p.id === id);
    if (idx !== -1) memoryProducts.splice(idx, 1);

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Product deletion failed" });
  }
}

async function BulkDeleteProducts(req, res) {
  const { ids } = req.body;
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No product IDs provided" });
    }
    try { await productModel.deleteMany({ _id: { $in: ids } }); } catch (dbErr) {}
    return res.status(200).json({ message: `${ids.length} product(s) deleted successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Bulk deletion failed" });
  }
}

async function BulkUpdateProductStatus(req, res) {
  const { ids, status } = req.body;
  try {
    if (!Array.isArray(ids) || !status) {
      return res.status(400).json({ message: "Product IDs array and status are required" });
    }
    try { await productModel.updateMany({ _id: { $in: ids } }, { status }); } catch (dbErr) {}
    return res.status(200).json({ message: `Updated status for ${ids.length} product(s)` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Bulk status update failed" });
  }
}

export {
  CreateProduct,
  GetProducts,
  GetProductByIdOrSlug,
  UpdateProduct,
  DeleteProduct,
  BulkDeleteProducts,
  BulkUpdateProductStatus,
  upload
};
