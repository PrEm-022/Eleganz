import React, { useEffect, useState } from 'react';
import './Popular.css';
import fallbackData from '../Assets/data';
import Item from '../Item/Item';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState(fallbackData);

  useEffect(() => {
    fetch('http://localhost:4000/popularinwomen')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPopularProducts(data);
        }
      })
      .catch((err) => console.log("Using fallback popular products"));
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR STYLES FOR YOU</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, i) => {
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
    </div>
  );
};

export default Popular;
