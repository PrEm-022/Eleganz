import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star.png';
import star_dull_icon from '../Assets/dull_star.png';
import { ShopContext } from '../../Context/ShopContext';

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart, currency } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState("M");

  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img className='productdisplay-main-img' src={product.image} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-star">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(198 reviews)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-old-price">{currency}{product.old_price}</div>
          <div className="productdisplay-right-new-price">{currency}{product.new_price}</div>
        </div>
        <div className="productdisplay-right-description">
          Stay stylishly with our premium fashion wear, perfect fusion of modern aesthetic, quality fabric, and comfort. Tailored to perfection for everyday elegance.
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size: <span className="selected-size-text">{selectedSize}</span></h1>
          <div className="productdisplay-right-sizes">
            {SIZES.map((sz) => (
              <div
                key={sz}
                className={selectedSize === sz ? "size-active" : ""}
                onClick={() => setSelectedSize(sz)}
              >
                {sz}
              </div>
            ))}
          </div>
          <button onClick={() => { addToCart(product.id); }}>
            ADD TO CART
          </button>
          <p className="productdisplay-right-category"><span>Category: </span>{product.category || 'Fashion'}, Clothing, Stylish</p>
          <p className="productdisplay-right-category"><span>Tags: </span>Modern, Latest, Premium</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
