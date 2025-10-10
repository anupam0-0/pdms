import { Request, Response } from 'express';
import FeaturedItems from '../models/FeaturedItems';
import Product from '../models/Product';
import { authMiddleware } from '../../middlewares/auth';

// Get all featured items
export const getAllFeaturedItems = async (req: Request, res: Response) => {
  try {
    const featuredItems = await FeaturedItems.find()
      .populate('item.product', 'name price category imageUrls')
      .sort({ createdAt: -1 });
    
    res.json(featuredItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured items', error });
  }
};

// Get active featured items (not expired)
export const getActiveFeaturedItems = async (req: Request, res: Response) => {
  try {
    const activeFeaturedItems = await FeaturedItems.find({
      'item.expiresOn': { $gt: new Date() }
    })
      .populate('item.product', 'name price category imageUrls')
      .sort({ createdAt: -1 });
    
    res.json(activeFeaturedItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active featured items', error });
  }
};

// Get featured item by ID
export const getFeaturedItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const featuredItem = await FeaturedItems.findById(req.params.id)
      .populate('item.product', 'name price category imageUrls');
    
    if (!featuredItem) {
      res.status(404).json({ message: 'Featured item not found' });
      return;
    }
    
    res.json(featuredItem);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured item', error });
  }
};

// Create new featured item (admin only)
export const createFeaturedItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    
    const { product, expiresOn } = req.body;
    
    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      res.status(400).json({ message: 'Product not found' });
      return;
    }
    
    // Check if product is already featured
    const existingFeatured = await FeaturedItems.findOne({
      'item.product': product,
      'item.expiresOn': { $gt: new Date() }
    });
    
    if (existingFeatured) {
      res.status(400).json({ 
        message: 'Product is already featured and not expired' 
      });
      return;
    }
    
    const featuredItemData = {
      item: {
        product,
        expiresOn: expiresOn || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days default
      }
    };
    
    const featuredItem = new FeaturedItems(featuredItemData);
    await featuredItem.save();
    
    const populatedFeaturedItem = await FeaturedItems.findById(featuredItem._id)
      .populate('item.product', 'name price category imageUrls');
    
    res.status(201).json(populatedFeaturedItem);
  } catch (error) {
    res.status(400).json({ message: 'Error creating featured item', error });
  }
};

// Update featured item (admin only)
export const updateFeaturedItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    
    const featuredItem = await FeaturedItems.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('item.product', 'name price category imageUrls');
    
    if (!featuredItem) {
      res.status(404).json({ message: 'Featured item not found' });
      return;
    }
    
    res.json(featuredItem);
  } catch (error) {
    res.status(400).json({ message: 'Error updating featured item', error });
  }
};

// Delete featured item (admin only)
export const deleteFeaturedItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    
    const featuredItem = await FeaturedItems.findByIdAndDelete(req.params.id);
    if (!featuredItem) {
      res.status(404).json({ message: 'Featured item not found' });
      return;
    }
    
    res.json({ message: 'Featured item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting featured item', error });
  }
};

// Clean up expired featured items (admin only)
export const cleanupExpiredFeaturedItems = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    
    const result = await FeaturedItems.deleteMany({
      'item.expiresOn': { $lt: new Date() }
    });
    
    res.json({ 
      message: `Cleaned up ${result.deletedCount} expired featured items` 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cleaning up expired items', error });
  }
};
