import React, { useContext } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);

  const targetCategory = props.category
    ? props.category.toLowerCase().replace(/s$/, '')
    : '';

  const filteredProducts = all_product.filter((item) => {
    const itemCat = item.category
      ? item.category.toLowerCase().replace(/s$/, '')
      : '';
    return targetCategory === itemCat;
  });

  return (
    <div className='shop-category'>
      <div className="shopcategory-banners">
        <img src={props.banner} alt="" />
      </div>
      
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-{filteredProducts.length}</span> out of {filteredProducts.length} products
        </p>
        <div className="shopcategory-sort">
          Sort by ˅ 
        </div>
      </div>

      <div className="shopcategory-products">
        {filteredProducts.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
};

export default ShopCategory;
