import { Link, useSearchParams } from "react-router-dom";
import { tw } from "../../utils/twStyles.js";
import { getCategoryId, getCategoryKey, normalizeCategoryKey } from "../../utils/productHelpers.js";

const CategoryPills = ({
  siblingCategories,
  parentCategory,
  selectedCategory,
  chooseCategory,
}) => {
  const [params] = useSearchParams();
  const next = new URLSearchParams(params);
  next.delete("category");

  if (siblingCategories.length === 0) return null;

  return (
    <div className={tw("vanta-category-pills")}>
      {parentCategory && (
        <button
          type="button"
          onClick={() => chooseCategory(parentCategory)}
          className={tw(`vanta-category-pill ${
            normalizeCategoryKey(selectedCategory) ===
            normalizeCategoryKey(parentCategory.slug || parentCategory.name)
              ? "active"
              : ""
          }`)}
        >
          All {parentCategory.name}
        </button>
      )}

      {siblingCategories.map((category) => {
        const key = getCategoryKey(category);
        const active =
          normalizeCategoryKey(selectedCategory) === normalizeCategoryKey(key);

        return (
          <Link
            key={getCategoryId(category) || key}
            to={{ pathname: `/category/${key}`, search: next.toString() }}
            aria-current={active ? "page" : undefined}
            className={tw(`vanta-category-pill ${active ? "active" : ""}`)}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryPills;
