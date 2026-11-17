import handbagImage from "../assets/category/handbag-editorial.webp";

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
    description: "Structured satchels, totes and crossbody bags.",
    image: handbagImage,
  },
  {
    _id: "cat_dresses",
    name: "Dresses",
    slug: "dresses",
    description: "Fluid midis, slip dresses and evening silhouettes.",
    image: "/img/slipdress.jpg",
  },
  {
    _id: "cat_footwear",
    name: "Footwear",
    slug: "footwear",
    description: "Sculptural heels, pared-back flats and boots.",
    image: "/img/shoehero.jpg",
  },
  {
    _id: "cat_jewelry",
    name: "Jewelry",
    slug: "jewelry",
    description: "Earrings, pendants and other finishing pieces.",
    image: "/img/jewelhero.jpg",
  },
  {
    _id: "cat_tops",
    name: "Tops",
    slug: "tops",
    description: "Blouses, knitwear and everyday separates.",
    image: "/img/boatneck.jpg",
  },
];
  