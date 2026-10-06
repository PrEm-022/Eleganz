require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const initialProducts = [
  // Men (1 - 12)
  { id: 1, name: "Dark Blue Mens Oversized Fur Jacket", category: "Men", image: "http://localhost:4000/images/product_1.png", new_price: 2499, old_price: 3499 },
  { id: 2, name: "Brown Mens Leather Jacket", category: "Men", image: "http://localhost:4000/images/product_2.png", new_price: 2999, old_price: 3999 },
  { id: 3, name: "Blue Coloured Stylish Denim Shirt", category: "Men", image: "http://localhost:4000/images/product_3.png", new_price: 1299, old_price: 1899 },
  { id: 4, name: "Olive Coloured Mens Plain Shirt", category: "Men", image: "http://localhost:4000/images/product_4.png", new_price: 999, old_price: 1499 },
  { id: 5, name: "Mens White Polos", category: "Men", image: "http://localhost:4000/images/product_5.png", new_price: 899, old_price: 1299 },
  { id: 6, name: "Mens Brown Varsity Jacket", category: "Men", image: "http://localhost:4000/images/product_6.png", new_price: 3499, old_price: 4499 },
  { id: 7, name: "Mens Oversized Grey Coloured T-Shirt", category: "Men", image: "http://localhost:4000/images/product_7.png", new_price: 799, old_price: 1199 },
  { id: 8, name: "Grey Coloured Mens Puffer Jacket", category: "Men", image: "http://localhost:4000/images/product_8.png", new_price: 2799, old_price: 3799 },
  { id: 9, name: "Grey Coloured Mens Gymwear", category: "Men", image: "http://localhost:4000/images/product_9.png", new_price: 1199, old_price: 1699 },
  { id: 10, name: "Floral Blue Beach Look Shirt", category: "Men", image: "http://localhost:4000/images/product_10.png", new_price: 1499, old_price: 2199 },
  { id: 11, name: "Mens Korean Pleated Creame Pants", category: "Men", image: "http://localhost:4000/images/product_11.png", new_price: 1899, old_price: 2599 },
  { id: 12, name: "Mens Denim Blue Baggy Pants", category: "Men", image: "http://localhost:4000/images/product_12.png", new_price: 1799, old_price: 2399 },

  // Women (13 - 24)
  { id: 13, name: "Brown Coloured Womens Cute Dress", category: "Women", image: "http://localhost:4000/images/product_13.png", new_price: 2199, old_price: 3199 },
  { id: 14, name: "Womens Vintage Maroon Dress", category: "Women", image: "http://localhost:4000/images/product_14.png", new_price: 1999, old_price: 2899 },
  { id: 15, name: "Womens Oversized Creme Flannel Shirt", category: "Women", image: "http://localhost:4000/images/product_15.png", new_price: 1299, old_price: 1799 },
  { id: 16, name: "Bottle Green Womens Top", category: "Women", image: "http://localhost:4000/images/product_16.png", new_price: 999, old_price: 1499 },
  { id: 17, name: "Womens Denim Short Dress", category: "Women", image: "http://localhost:4000/images/product_17.png", new_price: 1699, old_price: 2299 },
  { id: 18, name: "Womens Floral Print Summer Dress", category: "Women", image: "http://localhost:4000/images/product_18.png", new_price: 1899, old_price: 2499 },
  { id: 19, name: "Womens White Casual Crop Top", category: "Women", image: "http://localhost:4000/images/product_19.png", new_price: 799, old_price: 1199 },
  { id: 20, name: "Womens Classic Black Blazer", category: "Women", image: "http://localhost:4000/images/product_20.png", new_price: 2999, old_price: 3999 },
  { id: 21, name: "Womens Pink Pleated Skirt", category: "Women", image: "http://localhost:4000/images/product_21.png", new_price: 1299, old_price: 1799 },
  { id: 22, name: "Black Bodycon Short Dress", category: "Women", image: "http://localhost:4000/images/product_22.png", new_price: 1999, old_price: 2799 },
  { id: 23, name: "Purple Coloured Womens Joggers for Gym", category: "Women", image: "http://localhost:4000/images/product_23.png", new_price: 999, old_price: 1499 },
  { id: 24, name: "Stylish Houndstooth Bodycon Dress", category: "Women", image: "http://localhost:4000/images/product_24.png", new_price: 2499, old_price: 3299 },

  // Kid (25 - 36)
  { id: 25, name: "Boys Grey Coloured Check Coat Pants", category: "Kid", image: "http://localhost:4000/images/product_25.png", new_price: 1499, old_price: 1999 },
  { id: 26, name: "Girls Black Varsity Jacket", category: "Kid", image: "http://localhost:4000/images/product_26.png", new_price: 1599, old_price: 2199 },
  { id: 27, name: "Boys Grey Stylish Bomber Jacket", category: "Kid", image: "http://localhost:4000/images/product_27.png", new_price: 1299, old_price: 1799 },
  { id: 28, name: "Boys Green Fur Jacket", category: "Kid", image: "http://localhost:4000/images/product_28.png", new_price: 1399, old_price: 1899 },
  { id: 29, name: "Boys Blue Coloured Check Shirt", category: "Kid", image: "http://localhost:4000/images/product_29.png", new_price: 699, old_price: 999 },
  { id: 30, name: "Cute Maroon Short Dress for Girls", category: "Kid", image: "http://localhost:4000/images/product_30.png", new_price: 1699, old_price: 2299 },
  { id: 31, name: "Girls Brown Sweater", category: "Kid", image: "http://localhost:4000/images/product_31.png", new_price: 999, old_price: 1399 },
  { id: 32, name: "Stylish Star Themed Dress For Girls", category: "Kid", image: "http://localhost:4000/images/product_32.png", new_price: 1899, old_price: 2499 },
  { id: 33, name: "Black Varsity Jacket for Boys", category: "Kid", image: "http://localhost:4000/images/product_33.png", new_price: 1399, old_price: 1799 },
  { id: 34, name: "Boys Blue Stylish Denim Shirt", category: "Kid", image: "http://localhost:4000/images/product_34.png", new_price: 799, old_price: 1199 },
  { id: 35, name: "Floral Print Blue Dress For Girls", category: "Kid", image: "http://localhost:4000/images/product_35.png", new_price: 1799, old_price: 2399 },
  { id: 36, name: "Cute Pink Gown for Girls", category: "Kid", image: "http://localhost:4000/images/product_36.png", new_price: 1999, old_price: 2699 }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/eleganz";
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully!");

    await Product.deleteMany({});
    console.log("Cleared existing products.");

    await Product.insertMany(initialProducts);
    console.log(`Successfully seeded ALL ${initialProducts.length} products (Men, Women, Kid) into MongoDB!`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding MongoDB:", error);
    process.exit(1);
  }
};

seedDB();
