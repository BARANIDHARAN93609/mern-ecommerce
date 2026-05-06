const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");
dotenv.config();

const products = [
  { name: "Wireless Headphones", description: "Premium over-ear wireless headphones with ANC", price: 2499, category: "Electronics", brand: "SoundMax", emoji: "🎧", countInStock: 50, rating: 4.5, numReviews: 12 },
  { name: "Mechanical Keyboard", description: "RGB mechanical keyboard with blue switches", price: 3999, category: "Electronics", brand: "KeyPro", emoji: "⌨️", countInStock: 30, rating: 4.7, numReviews: 8 },
  { name: "Running Shoes", description: "Lightweight breathable running shoes", price: 1899, category: "Footwear", brand: "SwiftStride", emoji: "👟", countInStock: 80, rating: 4.3, numReviews: 25 },
  { name: "Cotton T-Shirt", description: "100% organic cotton comfortable T-shirt", price: 499, category: "Clothing", brand: "CottonCo", emoji: "👕", countInStock: 200, rating: 4.1, numReviews: 40 },
  { name: "Backpack 30L", description: "Durable waterproof 30L travel backpack", price: 1299, category: "Accessories", brand: "TrekMate", emoji: "🎒", countInStock: 60, rating: 4.6, numReviews: 18 },
  { name: "Desk Lamp LED", description: "Eye-care LED desk lamp with adjustable brightness", price: 899, category: "Home", brand: "BrightLife", emoji: "💡", countInStock: 45, rating: 4.4, numReviews: 10 },
  { name: "Yoga Mat 6mm", description: "Non-slip extra thick yoga and exercise mat", price: 699, category: "Fitness", brand: "ZenFlex", emoji: "🧘", countInStock: 100, rating: 4.2, numReviews: 30 },
  { name: "Ceramic Coffee Mug", description: "350ml ceramic mug microwave safe", price: 349, category: "Kitchen", brand: "BrewHouse", emoji: "☕", countInStock: 150, rating: 4.0, numReviews: 55 },
  { name: "Polarised Sunglasses", description: "UV400 polarised sunglasses unisex", price: 999, category: "Accessories", brand: "SunShield", emoji: "🕶️", countInStock: 70, rating: 4.3, numReviews: 22 },
  { name: "Novel: Dune", description: "Frank Herbert's Dune — paperback edition", price: 449, category: "Books", brand: "Ace Books", emoji: "📚", countInStock: 90, rating: 4.9, numReviews: 80 },
  { name: "Smart Watch", description: "Fitness smart watch with heart-rate monitor", price: 5499, category: "Electronics", brand: "FitTech", emoji: "⌚", countInStock: 25, rating: 4.6, numReviews: 15 },
  { name: "Stainless Water Bottle", description: "1L insulated stainless steel water bottle", price: 299, category: "Fitness", brand: "HydroLife", emoji: "🫙", countInStock: 120, rating: 4.5, numReviews: 48 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    const admin = await User.create({ name: "Admin User", email: "admin@shopmern.in", password: "admin123", role: "admin" });
    const demo  = await User.create({ name: "Demo User",  email: "demo@shopmern.in",  password: "demo123"  });
    console.log(`Created admin: ${admin.email}`);
    console.log(`Created demo:  ${demo.email}`);

    console.log("Seeding complete ✓");
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seed();
