import { Request, Response } from 'express';
export declare const getAllFeaturedItems: (req: Request, res: Response) => Promise<void>;
export declare const getActiveFeaturedItems: (req: Request, res: Response) => Promise<void>;
export declare const getFeaturedItemById: (req: Request, res: Response) => Promise<void>;
export declare const createFeaturedItem: (req: Request, res: Response) => Promise<void>;
export declare const updateFeaturedItem: (req: Request, res: Response) => Promise<void>;
export declare const deleteFeaturedItem: (req: Request, res: Response) => Promise<void>;
export declare const cleanupExpiredFeaturedItems: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=featuredItems.controller.d.ts.map