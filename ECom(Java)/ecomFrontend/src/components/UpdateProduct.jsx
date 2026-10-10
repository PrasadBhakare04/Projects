
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./UpdateProduct.css";

const API_URL = "http://localhost:8080/api/product";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    releaseDate: "",
    available: false,
    imageName: "",
  });

  const [currentImage, setCurrentImage] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch the existing product and its image
  useEffect(() => {
    let active = true;
    let imageUrl = "";

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        const data = response.data;

        if (!active) return;

        setProduct({
          name: data.name ?? "",
          brand: data.brand ?? "",
          description: data.description ?? "",
          price: data.price ?? "",
          category: data.category ?? "",
          quantity: data.quantity ?? "",
          releaseDate: data.releaseDate
            ? String(data.releaseDate).substring(0, 10)
            : "",
          available: data.available ?? false,
          imageName: data.imageName ?? "",
        });

        if (data.imageName) {
          const imageResponse = await axios.get(
            `${API_URL}/${id}/image`,
            { responseType: "blob" }
          );

          if (!active) return;

          imageUrl = URL.createObjectURL(imageResponse.data);
          setCurrentImage(imageUrl);
          setPreviewImage(imageUrl);
        }
      } catch (err) {
        console.error("Error fetching product:", err);

        if (active) {
          setError("Unable to load product. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      active = false;

      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [id]);

  // Handle text, number, date, and select fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProduct((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle availability checkbox
  const handleAvailabilityChange = (e) => {
    setProduct((previous) => ({
      ...previous,
      available: e.target.checked,
    }));
  };

  // Preview the newly selected image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      e.target.value = "";
      return;
    }

    setError("");
    setImage(file);

    setPreviewImage((previous) => {
      if (previous && previous !== currentImage) {
        URL.revokeObjectURL(previous);
      }

      return URL.createObjectURL(file);
    });
  };

  // Update product
  const submitHandler = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();

      const updatedProduct = {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
      };

      formData.append(
        "product",
        new Blob([JSON.stringify(updatedProduct)], {
          type: "application/json",
        })
      );

      // Use the new image if selected; otherwise preserve the old image.
      let imageFile = image;

      if (!imageFile && product.imageName) {
        const imageResponse = await axios.get(
          `${API_URL}/${id}/image`,
          { responseType: "blob" }
        );

        imageFile = new File(
          [imageResponse.data],
          product.imageName,
          {
            type: imageResponse.data.type || "application/octet-stream",
          }
        );
      }

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await axios.put(`${API_URL}/${id}`, formData);

      alert("Product updated successfully!");

      // Return to your existing product detail route.
      navigate(`/product/${id}`);
    } catch (err) {
      console.error("Error updating product:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update product. Please check the backend."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="update-page">
        <h2 className="update-heading">Loading product...</h2>
      </div>
    );
  }

  if (error && !product.name) {
    return (
      <div className="update-page">
        <div className="update-form-container">
          <p className="update-error">{error}</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="update-page">
      <div className="update-form-container">
        <h2 className="update-heading">Update Product</h2>

        {error && <div className="update-error">{error}</div>}

        <form className="row g-3" onSubmit={submitHandler}>
          <div className="col-md-6 update-field">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder="Product Name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-6 update-field">
            <label htmlFor="brand" className="form-label">
              Brand
            </label>
            <input
              id="brand"
              type="text"
              className="form-control"
              placeholder="Enter your Brand"
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-12 update-field">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              className="form-control"
              placeholder="Add product description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              rows="2"
              required
            />
          </div>

          <div className="col-md-5 update-field">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              id="price"
              type="number"
              className="form-control"
              placeholder="Eg: $1000"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="col-md-7 update-field">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              className="form-select"
              name="category"
              value={product.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select category</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <div className="col-md-4 update-field">
            <label htmlFor="quantity" className="form-label">
              Stock Quantity
            </label>
            <input
              id="quantity"
              type="number"
              className="form-control"
              placeholder="Stock Remaining"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              min="0"
              step="1"
              required
            />
          </div>

          <div className="col-md-4 update-field">
            <label htmlFor="releaseDate" className="form-label">
              Release Date
            </label>
            <input
              id="releaseDate"
              type="date"
              className="form-control"
              name="releaseDate"
              value={product.releaseDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-4 update-field">
            <label htmlFor="imageFile" className="form-label">
              Image
            </label>
            <input
              id="imageFile"
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="col-12 update-field">
            <label className="form-label">
              {image ? "New Image Preview" : "Current Image Preview"}
            </label>

            <div className="update-image-preview">
              {previewImage ? (
                <img src={previewImage} alt="Product preview" />
              ) : (
                <p>No image available</p>
              )}
            </div>

            <small className="update-help">
              Choose a new image only if you want to replace the current one.
            </small>
          </div>

          <div className="col-12">
            <div className="form-check update-availability">
              <input
                id="available"
                className="form-check-input"
                type="checkbox"
                name="available"
                checked={product.available}
                onChange={handleAvailabilityChange}
              />
              <label className="form-check-label" htmlFor="available">
                Product Available
              </label>
            </div>
          </div>

          <div className="col-12 update-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
