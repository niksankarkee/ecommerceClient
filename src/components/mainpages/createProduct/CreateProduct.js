import React, { useState, useContext } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/Loading/Loading";

const initialState = {
  product_id: "",
  title: "",
  price: 0,
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices feugiat egestas.  Vivamus vestibulum, felis nec laoreet rhoncus",
  category: "",
};

function CreateProduct() {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      return alert("You're not an admin");
    }
    const file = e.target.files[0];
    if (!file) {
      return alert("File not exist.");
    }
    if (file.size > 1024 * 1024) {
      // 1mb
      return alert("File size too large!");
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      return alert("File format is incorrect.");
    }

    let formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await axios.post("/api/upload", formData, {
      headers: { "content-type": "multipart/form-data", Authorization: token },
    });

    setLoading(false);
    setImages(res.data);

    try {
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin) {
        return alert("You're not an admin");
      }
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };

  return (
    <>
      {/* {alert && <h3>{alert}</h3>} */}
      <div id="ad_create_product">
        <div className="upload">
          <input type="file" name="file" id="file_up" onChange={handleUpload} />
          {loading ? (
            <div id="file_img">
              <Loading />
            </div>
          ) : (
            <div id="file_img" style={styleUpload}>
              <img src={images ? images.url : ""} alt="" />
              <span onClick={handleDestroy}>X</span>
            </div>
          )}
        </div>

        <form>
          <div className="row">
            <label htmlFor="product_id">Product ID</label>
            <input
              type="text"
              name="product_id"
              id="product_id"
              required
              value={product.product_id}
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={product.title}
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              required
              value={product.price}
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              name="description"
              rows="5"
              id="description"
              required
              value={product.description}
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="content">Content</label>
            <textarea
              type="text"
              name="content"
              rows="7"
              id="content"
              required
              value={product.content}
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="categories">Categories: </label>
            <select
              style={{ minWidth: "150px", textTransform: "capitalize" }}
              name="category"
              value={product.category}
              required
              onChange={handleChangeInput}
            >
              <option value="">Please select a category!</option>
              {categories.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
}

export default CreateProduct;
