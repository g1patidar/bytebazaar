// src/controllers/project.controller.ts

import { Request, Response } from 'express';
import Project from '../models/project.model';
import fs from 'fs';
import { uploadToDrive } from '../services/drive.service';

// GET /api/projects
export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search = '',
            minPrice,
            maxPrice
        } = req.query;
        // Build filter object
        const filter: any = {};
        
        // Add search functionality
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Add price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Calculate skip value for pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Build sort object
        const sort: any = {};
        sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

        // Get total count for pagination
        const total = await Project.countDocuments(filter);

        // Fetch projects with filters, sorting, and pagination
        const projects = await Project.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .populate('createdBy', 'name email avatar')
            .populate('reviews.user', 'name avatar');

        res.status(200).json({
            projects,
            pagination: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                hasMore: skip + projects.length < total
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching projects', error: err });
    }
};

// GET /api/projects/category/:categoryName
export const getProjectsByCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const category = req.params.categoryName;
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search = ''
        } = req.query;

        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        // Build filter object
        const filter: any = {
            category: category === 'all' ? { $exists: true } : category
        };

        // Add search functionality
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const sort: any = {};
        sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

        const total = await Project.countDocuments(filter);
        const projects = await Project.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .populate('createdBy', 'name email avatar')
            .populate('reviews.user', 'name avatar');

        res.status(200).json({
            projects,
            pagination: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                hasMore: skip + projects.length < total
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching projects by category', error: err });
    }
};

// GET /api/projects/user/:userId
export const getUserProjects = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const filter = { createdBy: userId };
        const skip = (Number(page) - 1) * Number(limit);

        const total = await Project.countDocuments(filter);
        const projects = await Project.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('createdBy', 'name email avatar')
            .populate('reviews.user', 'name avatar');

        res.status(200).json({
            projects,
            pagination: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                hasMore: skip + projects.length < total
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user projects', error: err });
    }
};

// GET /api/projects/:id
export const getProjectById = async (req: Request, res: Response): Promise<any> => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'name email avatar')
            .populate('reviews.user', 'name avatar');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Increment views count or handle project statistics here if needed
        
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching project', error: err });
    }
};

// GET /api/projects/trending
export const getTrendingProjects = async (req: Request, res: Response): Promise<any> => {
    try {
        const { limit = 5 } = req.query;

        const projects = await Project.find()
            .sort({ 
                'reviews.rating': -1, 
                createdAt: -1 
            })
            .limit(Number(limit))
            .populate('createdBy', 'name email avatar');

        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching trending projects', error: err });
    }
};

// POST /api/projects
export const createProject = async (req: Request, res: Response) => {
    try {
        const {
            title,
            description,
            category,
            status,
            price,
            thumbnail,
            files
        } = req.body;

        const newProject = new Project({
            title,
            description,
            category,
            status,
            price,
            thumbnail,
            files,
            createdBy: req.user?.userId,
        });

        const savedProject = await newProject.save();
        const populatedProject = await savedProject
            .populate('createdBy', 'name email avatar');

        res.status(201).json(populatedProject);
    } catch (err) {
        res.status(500).json({ message: 'Error creating project', error: err });
    }
};



// POST /api/upload-thumbnail
// POST /api/upload-project-file
export const uploadFileToDrive = async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
        
      const result = await uploadToDrive(req.file.path, req.file.mimetype);
  
      // Delete local file after uploading
      fs.unlinkSync(req.file.path);
  
      res.status(200).json({
        message: 'File uploaded successfully',
        fileUrl: result.webViewLink,
        fileId: result.fileId,
      });
    } catch (error: any) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
  };

// PUT /api/projects/:id
export const updateProject = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is authorized to update
        if (project.createdBy.toString() !== req.user?.userId) {
            return res.status(403).json({ message: 'Not authorized to update this project' });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        ).populate('createdBy', 'name email avatar');

        res.status(200).json(updatedProject);
    } catch (err) {
        res.status(500).json({ message: 'Error updating project', error: err });
    }
};

// DELETE /api/projects/:id
export const deleteProject = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is authorized to delete
        if (project.createdBy.toString() !== req.user?.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this project' });
        }

        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting project', error: err });
    }
};