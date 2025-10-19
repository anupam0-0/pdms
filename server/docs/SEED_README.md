# Database Seeding Guide

This guide explains how to use the seed file to populate your **Pharmacy Drug Management System (PDMS)** database with sample data.

## Overview

The seed file (`src/seed.ts`) creates comprehensive sample data for all models in the PDMS system:

- **Users**: Admin, doctors, and pharmaceutical suppliers
- **Products**: Medications, supplements, and medical supplies
- **Inventory**: Drug stock records with expiry tracking
- **Orders**: Prescription orders with different statuses
- **Featured Items**: Featured medications with expiration dates

## Prerequisites

1. Make sure MongoDB is running
2. Set up your environment variables (`.env` file)
3. Install dependencies: `npm install`

## Running the Seed Script

### Option 1: Run once
```bash
npm run seed
```

### Option 2: Run with auto-restart (development)
```bash
npm run seed:dev
```

## What Gets Created

### Users (6 total)
- **Admin**: `admin@pdms.com` / `admin123`
- **Doctors**: `doctor1@example.com`, `doctor2@example.com` / `password123`
- **Pharmaceutical Suppliers**: `pharma1@example.com`, `pharma2@example.com`, `pharma3@example.com` / `password123`

### Products (12 total)
- **Pain Relief**: Paracetamol 500mg, Ibuprofen 400mg
- **Antibiotics**: Amoxicillin 250mg
- **Allergy**: Cetirizine 10mg
- **Gastrointestinal**: Omeprazole 20mg
- **Diabetes**: Metformin 500mg
- **Cardiovascular**: Atorvastatin 20mg, Lisinopril 10mg
- **Supplements**: Multivitamin Tablets, Vitamin D3 1000IU
- **Respiratory**: Cough Syrup, Saline Nasal Spray

### Inventory Records (12 total)
- Each medication has an inventory record with stock levels
- Low stock thresholds set to 20% of initial stock
- Stock updated based on prescription orders
- Proper expiry date tracking for all medications

### Orders (3 total)
- **Delivered Order**: 10x Paracetamol + 5x Cetirizine (Dr. Rajesh Kumar)
- **Processing Order**: 8x Ibuprofen + 2x Multivitamin (Dr. Priya Sharma)
- **Pending Order**: 3x Atorvastatin + 2x Lisinopril (Dr. Rajesh Kumar)

### Featured Items (3 total)
- Paracetamol 500mg (expires in 14 days)
- Cetirizine 10mg (expires in 7 days)
- Multivitamin Tablets (expires in 21 days)

## Data Relationships

- Medications are assigned to different pharmaceutical suppliers
- Inventory records link medications to their suppliers with expiry tracking
- Prescription orders contain multiple medications with proper pricing
- Featured medications have expiration dates for promotional periods
- All data includes proper timestamps for audit trails

## Important Notes

⚠️ **Warning**: The seed script will **DELETE ALL EXISTING DATA** before creating new sample data.

✅ **Safe to run**: The script includes proper error handling and will close the database connection when finished.

## Customization

To modify the seed data:

1. Edit the arrays in `src/seed.ts`:
   - `sampleUsers` - Add/modify users
   - `sampleProducts` - Add/modify products
   - `sampleOrders` - Add/modify orders
   - `featuredItems` - Add/modify featured items

2. Run the seed script again to apply changes

## Troubleshooting

### Common Issues

1. **Connection Error**: Make sure MongoDB is running and connection string is correct
2. **Permission Error**: Ensure the database user has read/write permissions
3. **Memory Error**: For large datasets, consider running in smaller batches

### Logs

The seed script provides detailed logging:
- ✅ Success messages for each step
- ❌ Error messages with details
- 📊 Summary of created records

## Testing the Data

After seeding, you can test the API endpoints:

```bash
# Test admin login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@pdms.com", "password": "admin123"}'

# Test doctor login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "doctor1@example.com", "password": "password123"}'

# Get all medications
curl http://localhost:5000/api/products

# Get featured medications
curl http://localhost:5000/api/featured-items/active

# Get low stock medications
curl http://localhost:5000/api/inventory/low-stock
```

## Clean Database

To start fresh, simply run the seed script again - it will clear all existing data first.
