import { Request, Response } from 'express';
import FeaturedItems from '../models/FeaturedItems';
import Product from '../models/Product';
import { authMiddleware } from '../../middlewares/auth';
import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendNotFound,
  sendForbidden,
  sendServerError,
} from '../../utils/responseHelper';

// Get all featured items
export const getAllFeaturedItems = async (req: Request, res: Response) => {
  try {
    const featuredItems = await FeaturedItems.find()
      .populate('item.product', 'name price category imageUrls')
      .sort({ createdAt: -1 });
    
    sendSuccess(res, 'Featured items fetched successfully', featuredItems);
  } catch (error) {
    sendServerError(res, 'Error fetching featured items', error instanceof Error ? error.message : 'Unknown error');
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
    
    sendSuccess(res, 'Active featured items fetched successfully', activeFeaturedItems);
  } catch (error) {
    sendServerError(res, 'Error fetching active featured items', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Get featured item by ID
export const getFeaturedItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const featuredItem = await FeaturedItems.findById(req.params.id)
      .populate('item.product', 'name price category imageUrls');
    
    if (!featuredItem) {
      sendNotFound(res, 'Featured item not found', 'FeaturedItemNotFoundError');
      return;
    }
    
    sendSuccess(res, 'Featured item fetched successfully', featuredItem);
  } catch (error) {
    sendServerError(res, 'Error fetching featured item', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Create new featured item (admin only)
export const createFeaturedItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      sendForbidden(res, 'Admin access required', 'AdminAccessRequiredError');
      return;
    }
    
    const { product, expiresOn } = req.body;
    
    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      sendBadRequest(res, 'Product not found', 'ProductNotFoundError');
      return;
    }
    
    // Check if product is already featured
    const existingFeatured = await FeaturedItems.findOne({
      'item.product': product,
      'item.expiresOn': { $gt: new Date() }
    });
    
    if (existingFeatured) {
      sendBadRequest(res, 'Product is already featured and not expired', 'ProductAlreadyFeaturedError');
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
    
    sendCreated(res, 'Featured item created successfully', populatedFeaturedItem);
  } catch (error) {
    sendBadRequest(res, 'Error creating featured item', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Update featured item (admin only)
export const updateFeaturedItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      sendForbidden(res, 'Admin access required', 'AdminAccessRequiredError');
      return;
    }
    
    const featuredItem = await FeaturedItems.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('item.product', 'name price category imageUrls');
    
    if (!featuredItem) {
      sendNotFound(res, 'Featured item not found', 'FeaturedItemNotFoundError');
      return;
    }
    
    sendSuccess(res, 'Featured item updated successfully', featuredItem);
  } catch (error) {
    sendBadRequest(res, 'Error updating featured item', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Delete featured item (admin only)
export const deleteFeaturedItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      sendForbidden(res, 'Admin access required', 'AdminAccessRequiredError');
      return;
    }
    
    const featuredItem = await FeaturedItems.findByIdAndDelete(req.params.id);
    if (!featuredItem) {
      sendNotFound(res, 'Featured item not found', 'FeaturedItemNotFoundError');
      return;
    }
    
    sendSuccess(res, 'Featured item deleted successfully');
  } catch (error) {
    sendServerError(res, 'Error deleting featured item', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Clean up expired featured items (admin only)
export const cleanupExpiredFeaturedItems = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      sendForbidden(res, 'Admin access required', 'AdminAccessRequiredError');
      return;
    }
    
    const result = await FeaturedItems.deleteMany({
      'item.expiresOn': { $lt: new Date() }
    });
    
    sendSuccess(res, `Cleaned up ${result.deletedCount} expired featured items`, { deletedCount: result.deletedCount });
  } catch (error) {
    sendServerError(res, 'Error cleaning up expired items', error instanceof Error ? error.message : 'Unknown error');
  }
};
