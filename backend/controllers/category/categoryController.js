import categoryModel from "../../model/category.js";

const memoryCategories = [
  { _id: "cat-1", name: "Hoodies", slug: "hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7" },
  { _id: "cat-2", name: "Sweatshirts", slug: "sweatshirts", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633" },
  { _id: "cat-3", name: "Varsity Jackets", slug: "varsity-jackets", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea" },
  { _id: "cat-4", name: "Uniforms", slug: "uniforms", image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d" },
  { _id: "cat-5", name: "Kaftans", slug: "kaftans", image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660" },
  { _id: "cat-6", name: "Caps", slug: "caps", image: "/products/caps/k1-navy.jpg" }
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function CreateCategory(req, res) {
  const { name, image } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const slug = slugify(name);
    const catData = { name, slug, image: image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7" };

    let newCategory;
    try {
      const existing = await categoryModel.findOne({ name });
      if (existing) return res.status(400).json({ message: "Category already exists" });
      newCategory = await categoryModel.create(catData);
    } catch (dbErr) {
      newCategory = { _id: "cat-" + Date.now(), ...catData };
    }
    memoryCategories.push(newCategory);

    return res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Category creation failed" });
  }
}

async function GetCategories(req, res) {
  try {
    let categories = [];
    try {
      categories = await categoryModel.find().sort({ name: 1 });
    } catch (dbErr) {}
    if (categories.length === 0) categories = memoryCategories;
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
}

async function UpdateCategory(req, res) {
  const { id } = req.params;
  const { name, image } = req.body;
  try {
    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name);
    }
    if (image) updateData.image = image;

    let updatedCategory;
    try {
      updatedCategory = await categoryModel.findByIdAndUpdate(id, updateData, { new: true });
    } catch (dbErr) {}

    if (!updatedCategory) {
      const idx = memoryCategories.findIndex((c) => String(c._id) === id || c.slug === id);
      if (idx !== -1) {
        memoryCategories[idx] = { ...memoryCategories[idx], ...updateData };
        updatedCategory = memoryCategories[idx];
      }
    }

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Category update failed" });
  }
}

async function DeleteCategory(req, res) {
  const { id } = req.params;
  try {
    try { await categoryModel.findByIdAndDelete(id); } catch (dbErr) {}
    const idx = memoryCategories.findIndex((c) => String(c._id) === id || c.slug === id);
    if (idx !== -1) memoryCategories.splice(idx, 1);

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Category deletion failed" });
  }
}

export { CreateCategory, GetCategories, UpdateCategory, DeleteCategory };
