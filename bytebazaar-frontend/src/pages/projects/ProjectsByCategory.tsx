import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProjectsByCategory,
  selectProjects, 
  selectProjectLoading, 
  selectProjectError, 
  selectProjectFilters, 
  setFilters,
  Project 
} from '@/store/slices/projectSlice';
import ProjectCard from '@/components/project/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';

const ProjectsByCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const dispatch = useDispatch();
  
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);
  const error = useSelector(selectProjectError);
  const filters = useSelector(selectProjectFilters);
  
  useEffect(() => {
    dispatch(fetchProjectsByCategory(categoryId || 'all'));
  }, [categoryId, dispatch]);

  const filteredProjects = Array.isArray(projects) ? projects.filter((project: Project) => {
    const matchesSearch = project.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a: Project, b: Project) => {
    switch (filters.sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'popular':
        return (b.rating || 0) - (a.rating || 0);
      default: // 'latest'
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  }) : [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {categoryId === 'all' ? 'All Projects' : `${categoryId} Projects`}
          </h1>
          <p className="text-muted-foreground">
            {filteredProjects.length} projects found
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={filters.searchTerm}
              onChange={(e) => dispatch(setFilters({ searchTerm: e.target.value }))}
            />
          </div>
          
          <Select
            value={filters.sortBy}
            onValueChange={(value) => dispatch(setFilters({ sortBy: value as typeof filters.sortBy }))}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsByCategory;
