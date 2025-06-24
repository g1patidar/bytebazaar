import { Request, Response } from 'express';
import Category from '../models/category.model';

// GET /api/categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err });
  }
};

// POST /api/categories
export const createCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description } = req.body;
    console.log(name, 'name');
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (err) {
    res.status(500).json({ message: 'Error creating category', error: err });
  }
};

// PUT /api/categories/:id
export const updateCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ message: 'Category updated', category });
  } catch (err) {
    res.status(500).json({ message: 'Error updating category', error: err });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err });
  }
};
