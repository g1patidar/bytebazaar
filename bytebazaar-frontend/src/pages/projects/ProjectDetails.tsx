import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById, selectSelectedProject, selectProjectLoading, selectProjectError } from '@/store/slices/projectSlice';
import { addToCart, selectCartItems } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Star, Download, DollarSign, Calendar, Tag, FileText, User, MessageSquare, ExternalLink, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AppDispatch } from '@/store';
import dummy from '../../../public/assests/images/dummy.svg';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const project = useSelector(selectSelectedProject);
  const loading = useSelector(selectProjectLoading);
  const error = useSelector(selectProjectError);
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [projectId, dispatch]);

  const handleAddToCart = () => {
    if (!project) return;

    const isInCart = cartItems.some(item => item.projectId === project._id);
    if (isInCart) {
      toast.info('This project is already in your cart');
      return;
    }

    dispatch(addToCart(project));
    toast.success('Added to cart successfully');
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
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (!project) {
    return null;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {project.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
              {project.status}
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{project.rating?.toFixed(1) || 'No ratings'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-gray-500" />
              <span>{project.downloads || 0} downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span>{format(new Date(project.createdAt), 'MMM dd, yyyy')}</span>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">{project.description}</p>
        </div>

        {/* Purchase Card */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-3xl font-bold">${project.price}</span>
              <DollarSign className="h-6 w-6 text-green-500" />
            </CardTitle>
            <CardDescription>One-time purchase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">This purchase includes:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Full source code
                </li>
                <li className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Lifetime updates
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  6 months support
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({project.reviews?.length || 0})</TabsTrigger>
          <TabsTrigger value="author">Author</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Images */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${project.title} preview ${index + 1}`}
                    className="rounded-lg object-cover w-full aspect-video"
                  />
                ))}
              </div>

              {/* Features or Files */}
              <div className="grid md:grid-cols-2 gap-6">
                {project.files?.map((file, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {file}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {project.reviews?.map((review, index) => (
                <div key={index} className="border-b last:border-0 pb-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Avatar>
                      <AvatarImage src={review.user.avatar} />
                      <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{review.user.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="author">
          <Card>
            <CardHeader>
              <CardTitle>About the Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                {/* <Avatar className="h-16 w-16">
                  <AvatarImage src={project.author.avatar || dummy} />
                  <AvatarFallback>{project.author.name.charAt(0) || ''}</AvatarFallback>
                </Avatar> */}
                <div>
                  <h3 className="text-xl font-semibold">{project?.author?.name || ''}</h3>
                  <p className="text-muted-foreground">{project?.author?.email || ''}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>4.8 average rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>12 total projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>1.2k total sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Member since 2022</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
