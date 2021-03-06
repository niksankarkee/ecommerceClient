import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";
import Loading from "../utils/Loading/Loading";
import axios from "axios";

export default function Products() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.ProductsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;

  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get("/api/products");
      setProducts(res.data.products);
    };

    getProducts();
  }, [setProducts]);

  return (
    <>
      <div className="products">
        {products.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
            />
          );
        })}
      </div>
      {products.length === 0 && <Loading />}
    </>
  );
}
