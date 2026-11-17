import api from "./api";

let pendingCategories;

const getCategories = () => {
  pendingCategories ??= api.get("/categories")
    .then(({ data }) => data)
    .finally(() => { pendingCategories = undefined; });

  return pendingCategories;
};

const categoryService = {
  getCategories,
};

export default categoryService;