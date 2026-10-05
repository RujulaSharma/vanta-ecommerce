export const normalizeCategory = (value = "") =>
    String(value)
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  
  export const categoryImage = (category) => category?.image || "";
  
  export const getCategoryChildren = (categories = [], parent) => {
    const parentId = parent?._id ? String(parent._id) : "";
    const parentSlug = normalizeCategory(parent?.slug || parent?.name);
  
    return categories.filter((category) => {
      const relation = category?.parentCategory;
      if (!relation) return false;
  
      if (typeof relation === "object") {
        return (
          (relation._id && String(relation._id) === parentId) ||
          normalizeCategory(relation.slug || relation.name) === parentSlug
        );
      }
  
      return parentId && String(relation) === parentId;
    });
  };
  
  export const getRootCategories = (categories = []) =>
    categories.filter((category) => !category?.parentCategory);
  
export const fallbackRootCategories = [
  {
    _id: "cat_bags",
    name: "Bags",
    slug: "bags",
    description: "Luxury leather totes, structured satchels and everyday crossbody bags.",
    image: "https://res.cloudinary.com/q9toon94/image/upload/v1786812733/vanta-bags/products/handbag-4.jpg",
    itemCount: "24+ Styles",
  },
  {
    _id: "cat_dresses",
    name: "Dresses",
    slug: "dresses",
    description: "Sculpted evening gowns, effortless midi silhouettes & summer wear.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=85",
    itemCount: "18+ Styles",
  },
  {
    _id: "cat_footwear",
    name: "Footwear",
    slug: "footwear",
    description: "Architectural heels, minimalist flats and handcrafted leather boots.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",
    itemCount: "16+ Styles",
  },
  {
    _id: "cat_jewelry",
    name: "Jewelry",
    slug: "jewelry",
    description: "Fine 18k gold-plated accents, statement earrings & pendant necklaces.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85",
    itemCount: "20+ Styles",
  },
  {
    _id: "cat_tops",
    name: "Tops",
    slug: "tops",
    description: "Tailored silk blouses, structured knitwear & modern everyday essentials.",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=85",
    itemCount: "15+ Styles",
  },
];
  