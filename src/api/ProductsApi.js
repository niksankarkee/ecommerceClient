import { useState } from "react";

function ProductsApi() {
  const [products, setProducts] = useState([]);

  return {
    products: [products, setProducts],
  };
}

export default ProductsApi;
