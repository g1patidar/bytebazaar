import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';
import { fetchProjects, selectProjects, selectProjectLoading, selectProjectError } from '@/store/slices/projectSlice';
import ProjectCard from '@/components/project/ProjectCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Download, Star, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);
  const error = useSelector(selectProjectError);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const userProjects = projects?.filter(project => project.createdBy._id === user?._id) || [];
  const purchasedProjects = projects?.filter(project => project.purchases?.includes(user?._id)) || [];

  const stats = {
    totalSales: userProjects.reduce((acc, project) => acc + (project.sales || 0), 0),
    totalRevenue: userProjects.reduce((acc, project) => acc + ((project.sales || 0) * project.price), 0),
    averageRating: userProjects.reduce((acc, project) => acc + (project.rating || 0), 0) / (userProjects.length || 1),
    totalDownloads: userProjects.reduce((acc, project) => acc + (project.downloads || 0), 0),
  };

  const StatCard = ({ title, value, icon: Icon, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => dispatch(fetchProjects())}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Manage your projects and track your performance</p>
        </div>
        <Button className="mt-4 md:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Create New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Sales"
          value={stats.totalSales}
          icon={DollarSign}
          description="Total number of sales"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          description="Total revenue earned"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating.toFixed(1)}
          icon={Star}
          description="Average project rating"
        />
        <StatCard
          title="Total Downloads"
          value={stats.totalDownloads}
          icon={Download}
          description="Total project downloads"
        />
      </div>

      <Tabs defaultValue="my-projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="purchased">Purchased Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-projects">
          {userProjects.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Projects Yet</CardTitle>
                <CardDescription>
                  Start creating your first project to showcase your work
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="purchased">
          {purchasedProjects.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Purchased Projects</CardTitle>
                <CardDescription>
                  Browse our marketplace to find projects that interest you
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Button>
                  Browse Projects
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {purchasedProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
