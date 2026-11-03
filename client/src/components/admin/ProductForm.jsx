import { useEffect, useMemo } from "react";
import { X } from "lucide-react";

const ProductForm = ({
  form,
  categories,
  editingProduct,
  saving,
  onChange,
  onSubmit,
  onClose,
  onFormChange,
}) => {
  const imageFilePreviews = useMemo(
    () =>
      form.imageFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [form.imageFiles]
  );

  useEffect(() => {
    return () => {
      imageFilePreviews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [imageFilePreviews]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] text-[var(--vanta-text)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[var(--vanta-border)] bg-[var(--vanta-soft)]/50 px-6 py-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--vanta-muted)] uppercase">
              PRODUCT MANAGEMENT
            </p>
            <h2 className="mt-0.5 font-serif text-xl font-semibold">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-[var(--vanta-muted)] transition hover:bg-[var(--vanta-soft)] hover:text-[var(--vanta-text)]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold">Product Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] px-3 text-xs text-[var(--vanta-text)] outline-none focus:border-[var(--vanta-gold)]"
                placeholder="Example: Vanta Leather Tote"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                rows={3}
                className="mt-1.5 w-full resize-none rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] p-3 text-xs text-[var(--vanta-text)] outline-none focus:border-[var(--vanta-gold)]"
                placeholder="Describe the product..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Price (₹)</label>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={onChange}
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] px-3 text-xs text-[var(--vanta-text)] outline-none focus:border-[var(--vanta-gold)]"
                placeholder="2999"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Compare At Price (₹)</label>
              <input
                name="compareAtPrice"
                type="number"
                min="0"
                value={form.compareAtPrice}
                onChange={onChange}
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] px-3 text-xs text-[var(--vanta-text)] outline-none focus:border-[var(--vanta-gold)]"
                placeholder="3999"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={onChange}
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] px-3 text-xs text-[var(--vanta-text)] outline-none focus:border-[var(--vanta-gold)]"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold">SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={onChange}
                disabled={Boolean(editingProduct)}
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] px-3 text-xs uppercase text-[var(--vanta-text)] outline-none focus:border-[var(--vanta-gold)] disabled:opacity-50"
                placeholder="VB-TOTE-001"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Stock</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={onChange}
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] px-3 text-xs text-[var(--vanta-text)] outline-none focus:border-[var(--vanta-gold)]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Brand</label>
              <input
                name="brand"
                value={form.brand}
                onChange={onChange}
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] px-3 text-xs text-[var(--vanta-text)] outline-none focus:border-[var(--vanta-gold)]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Material</label>
              <input
                name="material"
                value={form.material}
                onChange={onChange}
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] px-3 text-xs text-[var(--vanta-text)] outline-none focus:border-[var(--vanta-gold)]"
                placeholder="Leather"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Color</label>
              <input
                name="color"
                value={form.color}
                onChange={onChange}
                className="mt-1.5 h-10 w-full rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-bg)] px-3 text-xs text-[var(--vanta-text)] outline-none focus:border-[var(--vanta-gold)]"
                placeholder="Black"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold">Product Images</label>
              <label
                htmlFor="product-images"
                className="mt-1.5 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[var(--vanta-border)] bg-[var(--vanta-soft)]/50 px-5 py-6 text-center transition hover:border-[var(--vanta-gold)] hover:bg-[var(--vanta-soft)]"
              >
                <span className="text-2xl">📷</span>
                <span className="mt-1.5 text-xs font-semibold text-[var(--vanta-text)]">Choose Images</span>
                <span className="mt-0.5 text-[11px] text-[var(--vanta-muted)]">
                  JPG, JPEG, PNG or WEBP · up to 5 MB each · max 10
                </span>
                <input
                  id="product-images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files || []);
                    onFormChange((current) => ({
                      ...current,
                      imageFiles: [...current.imageFiles, ...files],
                    }));
                    event.target.value = "";
                  }}
                  className="hidden"
                />
              </label>

              {(form.existingImages.length > 0 || form.imageFiles.length > 0) && (
                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {form.existingImages.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-soft)]"
                    >
                      <img
                        src={image}
                        alt={`${form.name || "Product"} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onFormChange((current) => ({
                            ...current,
                            existingImages: current.existingImages.filter(
                              (_, imageIndex) => imageIndex !== index
                            ),
                          }))
                        }
                        className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white shadow-xs hover:bg-black"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {form.imageFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.lastModified}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-soft)]"
                    >
                      <img
                        src={imageFilePreviews[index]?.url}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onFormChange((current) => ({
                            ...current,
                            imageFiles: current.imageFiles.filter(
                              (_, fileIndex) => fileIndex !== index
                            ),
                          }))
                        }
                        className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white shadow-xs hover:bg-black"
                        aria-label="Remove selected image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-2 text-[11px] text-[var(--vanta-muted)]">
                {editingProduct
                  ? "Keep existing images, remove them, or add new images."
                  : "Choose one or more images. The backend uploads them to Cloudinary automatically."}
              </p>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 sm:col-span-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={onChange}
                className="h-4 w-4 rounded border-[var(--vanta-border)] accent-[var(--vanta-gold)]"
              />
              <span className="text-xs font-medium text-[var(--vanta-text)]">Mark as featured product</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-[var(--vanta-border)] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-[var(--vanta-border)] bg-[var(--vanta-surface)] px-4 py-2.5 text-xs font-semibold text-[var(--vanta-text)] transition hover:bg-[var(--vanta-soft)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[var(--vanta-text)] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--vanta-bg)] shadow-xs transition hover:opacity-90 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingProduct
                ? "Save Changes"
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
