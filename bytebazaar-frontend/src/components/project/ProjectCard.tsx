import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { Project } from '@/types';
import { useDispatch } from 'react-redux';
import { setSelectedProject } from '@/store/slices/projectSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import dummy from '../../../public/assests/images/dummy.svg';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'compact';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, variant = 'default' }) => {
  const dispatch = useDispatch();

  const handleProjectClick = () => {
    dispatch(setSelectedProject(project));
  };
  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300">
        <Link to={`/projects/${project._id}`} onClick={handleProjectClick}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <img
                src={project.thumbnail || dummy}
                alt={project.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">{project.category}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 text-sm">{project.rating || 4.5}</span>
                </div>
              </div>
              <div className="ml-auto">
                <p className="font-bold text-lg">${project.price}</p>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <Link to={`/projects/${project._id}`} onClick={handleProjectClick}>
        <CardHeader className="p-0">
          <div className="relative">
            <img
              src={project.thumbnail || dummy }
              alt={project.title || 'Project Image'}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <Badge className="absolute top-2 right-2">
              ${project.price}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">{project.category}</Badge>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm">{project.rating || 4.5}</span>
            </div>
          </div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {project.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <img
                src={dummy}
                alt={project?.author?.name || 'Author Avatar'}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-muted-foreground">{project?.author?.name || 'Author'}</span>
            </div>
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProjectCard; 