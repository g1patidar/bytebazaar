import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  selectCategoryLoading, selectCategoryError, setCategories, updateCategory, deleteCategory, createCategory, selectAllCategories, fetchCategories } from '@/store/slices/categorySlice';
import { categoriesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AdminCategories = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const loading = useSelector(selectCategoryLoading);
  const error = useSelector(selectCategoryError);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll();
        dispatch(setCategories(response.data));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch categories',
          variant: 'destructive'
        });
      }
    };

    fetchCategories();
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (editingCategory) {
        const resultAction = await dispatch(updateCategory({ id: editingCategory._id, data: formData }) as any);

        if (updateCategory.fulfilled.match(resultAction)) {
          toast({
            title: 'Success',
            description: 'Category updated successfully',
          });
        } else {
          throw new Error('Update failed');
        }
      } else {
        const resultAction = await dispatch(createCategory(formData) as any);
        if (createCategory.fulfilled.match(resultAction)) {
          toast({
            title: 'Success',
            description: 'Category created successfully',
          });
        } else {
          throw new Error('Creation failed');
        }
      }
      
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      setIsAddDialogOpen(false);
      await categoriesApi.getAll();
  
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save category',
        variant: 'destructive',
      });
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const resultAction = await dispatch(deleteCategory(categoryId)as any);
  
        if (deleteCategory.fulfilled.match(resultAction)) {
          toast({
            title: 'Success',
            description: 'Category deleted successfully',
          });
        } else {
          throw new Error('Delete failed');
        }
  
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete category',
          variant: 'destructive',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Categories</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">Manage project categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                <DialogDescription>
                  {editingCategory
                    ? 'Edit the category details below'
                    : 'Create a new category for projects'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category._id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              {category.description && (
                <CardDescription>{category.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {/* Add additional category stats here if needed */}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(category)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(category._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
