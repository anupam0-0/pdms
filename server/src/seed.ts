import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./architecture/models/User";
import Product from "./architecture/models/Product";
import Inventory from "./architecture/models/Inventory";
import Order from "./architecture/models/Order";
import FeaturedItems from "./architecture/models/FeaturedItems";
import connectDB from "./config/connectDB";
import { startServer } from "./server";

// Utility to set expiry dates in the future (e.g., at least 2 years from now)
const futureDate = (years = 2, months = 0): Date => {
  const now = new Date();
  return new Date(now.getFullYear() + years, now.getMonth() + months, now.getDate());
};

// Sample data
const sampleUsers = [
  {
    fullName: "Dr. Admin",
    email: "admin@pdms.com",
    password: "admin123",
    role: "admin" as const,
    address: {
      line1: "123 Medical Center",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
  },
  {
    fullName: "Dr. Rajesh Kumar",
    email: "doctor1@example.com",
    password: "password123",
    role: "user" as const,
    address: {
      line1: "456 Health Clinic",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
    },
  },
  {
    fullName: "Dr. Priya Sharma",
    email: "doctor2@example.com",
    password: "password123",
    role: "user" as const,
    address: {
      line1: "789 Wellness Center",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
    },
  },
  {
    fullName: "MediCorp Pharmaceuticals",
    email: "pharma1@example.com",
    password: "password123",
    role: "seller" as const,
    address: {
      line1: "321 Pharma Plaza",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
    },
  },
  {
    fullName: "HealthPlus Distributors",
    email: "pharma2@example.com",
    password: "password123",
    role: "seller" as const,
    address: {
      line1: "654 Medical Street",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
    },
  },
  {
    fullName: "CareMed Supplies",
    email: "pharma3@example.com",
    password: "password123",
    role: "seller" as const,
    address: {
      line1: "987 Healthcare Lane",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700001",
    },
  },
];

const sampleProducts = [
  {
    name: "Paracetamol 500mg",
    description:
      "Pain reliever and fever reducer. Take 1-2 tablets every 4-6 hours as needed.",
    price: 25,
    category: "Pain Relief",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 500,
    expiryDate: futureDate(2, 8), // +2 years, +8 months
  },
  {
    name: "Ibuprofen 400mg",
    description:
      "Anti-inflammatory pain reliever. Take 1 tablet every 6-8 hours with food.",
    price: 45,
    category: "Pain Relief",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 300,
    expiryDate: futureDate(2, 6), // +2 years, +6 months
  },
  {
    name: "Amoxicillin 250mg",
    description:
      "Antibiotic for bacterial infections. Take as directed by physician.",
    price: 120,
    category: "Antibiotics",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 200,
    expiryDate: futureDate(2, 4), // +2 years, +4 months
  },
  {
    name: "Cetirizine 10mg",
    description: "Antihistamine for allergies. Take 1 tablet daily.",
    price: 35,
    category: "Allergy",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 400,
    expiryDate: futureDate(2, 7), // +2 years, +7 months
  },
  {
    name: "Omeprazole 20mg",
    description:
      "Proton pump inhibitor for acid reflux. Take 1 capsule daily before breakfast.",
    price: 85,
    category: "Gastrointestinal",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 250,
    expiryDate: futureDate(2, 5), // +2 years, +5 months
  },
  {
    name: "Metformin 500mg",
    description: "Diabetes medication. Take as prescribed by doctor.",
    price: 65,
    category: "Diabetes",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 350,
    expiryDate: futureDate(2, 3), // +2 years, +3 months
  },
  {
    name: "Atorvastatin 20mg",
    description:
      "Cholesterol-lowering medication. Take 1 tablet daily in the evening.",
    price: 95,
    category: "Cardiovascular",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 180,
    expiryDate: futureDate(2, 2), // +2 years, +2 months
  },
  {
    name: "Lisinopril 10mg",
    description:
      "ACE inhibitor for blood pressure. Take as directed by physician.",
    price: 75,
    category: "Cardiovascular",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 220,
    expiryDate: futureDate(2, 4), // +2 years, +4 months
  },
  {
    name: "Multivitamin Tablets",
    description:
      "Daily multivitamin supplement. Take 1 tablet daily with food.",
    price: 150,
    category: "Supplements",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 100,
    expiryDate: futureDate(2, 8), // +2 years, +8 months
  },
  {
    name: "Vitamin D3 1000IU",
    description: "Vitamin D supplement for bone health. Take 1 capsule daily.",
    price: 200,
    category: "Supplements",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 80,
    expiryDate: futureDate(2, 6), // +2 years, +6 months
  },
  {
    name: "Cough Syrup",
    description: "Expectorant cough syrup. Take 2 teaspoons every 4-6 hours.",
    price: 55,
    category: "Respiratory",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 120,
    expiryDate: futureDate(2, 1), // +2 years, +1 month
  },
  {
    name: "Saline Nasal Spray",
    description: "Sterile saline solution for nasal congestion relief.",
    price: 85,
    category: "Respiratory",
    imageUrls: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500",
    ],
    stock: 90,
    expiryDate: futureDate(2, 0), // +2 years, now
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await startServer();
    console.log("✅ Connected to database");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Inventory.deleteMany({});
    await Order.deleteMany({});
    await FeaturedItems.deleteMany({});
    console.log("✅ Cleared existing data");

    // Hash passwords
    console.log("🔐 Hashing passwords...");
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12),
      }))
    );

    // Create users
    console.log("👥 Creating users...");
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Get seller IDs for products
    const sellers = createdUsers.filter((user) => user.role === "seller");
    const admin = createdUsers.find((user) => user.role === "admin");
    const customers = createdUsers.filter((user) => user.role === "user");

    // Create products with seller assignments
    console.log("📦 Creating products...");
    const productsWithSellers = sampleProducts.map((product, index) => ({
      ...product,
      seller: sellers[index % sellers.length]._id,
    }));

    const createdProducts = await Product.insertMany(productsWithSellers);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create inventory records
    console.log("📊 Creating inventory records...");
    const inventoryRecords = createdProducts.map((product) => ({
      product: product._id,
      seller: product.seller,
      stock: product.stock,
      lowStockThreshold: Math.floor(product.stock * 0.2), // 20% of stock as threshold
    }));

    const createdInventory = await Inventory.insertMany(inventoryRecords);
    console.log(`✅ Created ${createdInventory.length} inventory records`);

    // Create sample orders
    console.log("🛒 Creating sample orders...");
    const sampleOrders = [
      {
        customer: customers[0]._id,
        items: [
          {
            product: createdProducts[0]._id, // Paracetamol
            quantity: 10,
            priceAtPurchase: createdProducts[0].price,
          },
          {
            product: createdProducts[3]._id, // Cetirizine
            quantity: 5,
            priceAtPurchase: createdProducts[3].price,
          },
        ],
        totalAmount:
          createdProducts[0].price * 10 + createdProducts[3].price * 5,
        status: "delivered" as const,
        paymentMethod: "upi" as const,
        shippingAddress: {
          line1: "456 Health Clinic",
          city: "Delhi",
          state: "Delhi",
          pincode: "110001",
        },
      },
      {
        customer: customers[1]._id,
        items: [
          {
            product: createdProducts[1]._id, // Ibuprofen
            quantity: 8,
            priceAtPurchase: createdProducts[1].price,
          },
          {
            product: createdProducts[8]._id, // Multivitamin
            quantity: 2,
            priceAtPurchase: createdProducts[8].price,
          },
        ],
        totalAmount:
          createdProducts[1].price * 8 + createdProducts[8].price * 2,
        status: "processing" as const,
        paymentMethod: "card" as const,
        shippingAddress: {
          line1: "789 Wellness Center",
          city: "Bangalore",
          state: "Karnataka",
          pincode: "560001",
        },
      },
      {
        customer: customers[0]._id,
        items: [
          {
            product: createdProducts[6]._id, // Atorvastatin
            quantity: 3,
            priceAtPurchase: createdProducts[6].price,
          },
          {
            product: createdProducts[7]._id, // Lisinopril
            quantity: 2,
            priceAtPurchase: createdProducts[7].price,
          },
        ],
        totalAmount:
          createdProducts[6].price * 3 + createdProducts[7].price * 2,
        status: "pending" as const,
        paymentMethod: "cod" as const,
        shippingAddress: {
          line1: "456 Health Clinic",
          city: "Delhi",
          state: "Delhi",
          pincode: "110001",
        },
      },
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${createdOrders.length} orders`);

    // Update inventory stock based on orders
    console.log("📉 Updating inventory based on orders...");
    for (const order of createdOrders) {
      for (const item of order.items) {
        await Inventory.findOneAndUpdate(
          { product: item.product },
          { $inc: { stock: -item.quantity } }
        );
      }
    }
    console.log("✅ Updated inventory stock");

    // Create featured items
    console.log("⭐ Creating featured items...");
    const featuredItems = [
      {
        item: {
          product: createdProducts[0]._id, // Paracetamol
          expiresOn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        },
      },
      {
        item: {
          product: createdProducts[3]._id, // Cetirizine
          expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      },
      {
        item: {
          product: createdProducts[8]._id, // Multivitamin
          expiresOn: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
        },
      },
    ];

    const createdFeaturedItems = await FeaturedItems.insertMany(featuredItems);
    console.log(`✅ Created ${createdFeaturedItems.length} featured items`);

    // Display summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`📦 Products: ${createdProducts.length}`);
    console.log(`📊 Inventory Records: ${createdInventory.length}`);
    console.log(`🛒 Orders: ${createdOrders.length}`);
    console.log(`⭐ Featured Items: ${createdFeaturedItems.length}`);

    console.log("\n🔑 Test Accounts:");
    console.log("Admin: admin@pdms.com / admin123");
    console.log("Doctor: doctor1@example.com / password123");
    console.log("Pharma: pharma1@example.com / password123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export default seedDatabase;
