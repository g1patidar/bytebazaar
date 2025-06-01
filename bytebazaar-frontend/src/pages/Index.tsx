
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Layers, Star, Search, Package, Download, CheckCircle, Users, Shield, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Categories data
  const categories = [
    { id: 'web', name: 'Web Development', icon: <Code className="h-6 w-6 mb-3 text-primary" /> },
    { id: 'mobile', name: 'Mobile Apps', icon: <Layers className="h-6 w-6 mb-3 text-indigo-500" /> },
    { id: 'data', name: 'Data Science', icon: <Search className="h-6 w-6 mb-3 text-blue-500" /> },
    { id: 'ai', name: 'AI & ML', icon: <Package className="h-6 w-6 mb-3 text-indigo-400" /> },
    { id: 'design', name: 'UI/UX Design', icon: <Star className="h-6 w-6 mb-3 text-violet-500" /> },
    { id: 'game', name: 'Game Dev', icon: <Download className="h-6 w-6 mb-3 text-fuchsia-500" /> }
  ];

  // Featured projects data
  const featuredProjects = [
    { 
      id: '1', 
      title: 'E-Commerce Platform', 
      category: 'Web Development', 
      price: 129.99, 
      image: '/placeholder.svg',
      rating: 4.8,
      reviews: 42
    },
    { 
      id: '2', 
      title: 'Food Delivery App', 
      category: 'Mobile Apps', 
      price: 99.99, 
      image: '/placeholder.svg',
      rating: 4.6,
      reviews: 37
    },
    { 
      id: '3', 
      title: 'AI Chatbot', 
      category: 'AI & Machine Learning', 
      price: 149.99, 
      image: '/placeholder.svg',
      rating: 4.9,
      reviews: 51
    },
    { 
      id: '4', 
      title: 'Portfolio Template', 
      category: 'UI/UX Design', 
      price: 79.99, 
      image: '/placeholder.svg',
      rating: 4.7,
      reviews: 29
    }
  ];

  // Features list
  const features = [
    {
      title: "Quality Assured",
      description: "All projects are vetted by our expert team for quality and maintainability.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      title: "Modern Technologies",
      description: "Projects built with the latest frameworks and best practices.",
      icon: <Code className="h-6 w-6 text-primary" />
    },
    {
      title: "Full Documentation",
      description: "Comprehensive guides to help you understand and customize the code.",
      icon: <Package className="h-6 w-6 text-primary" />
    },
    {
      title: "Community Support",
      description: "Join a thriving community of developers to get help and share knowledge.",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      title: "Lifetime Access",
      description: "Buy once and get lifetime access to updates and improvements.",
      icon: <Shield className="h-6 w-6 text-primary" />
    },
    {
      title: "Exclusive Benefits",
      description: "Registered users get access to special deals and early releases.",
      icon: <Gift className="h-6 w-6 text-primary" />
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-transparent dark:from-primary/10 dark:via-primary/5 dark:to-transparent text-foreground py-32 sm:py-40">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/f5406c36-013d-4921-81e0-548d62c35114.png')] bg-cover bg-center opacity-10 dark:opacity-5"></div>
        <div className="absolute inset-0 bg-background/40 backdrop-blur-sm"></div>
        
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient block mb-2">Code Projects</span>
                <span>That Inspire Excellence</span>
              </h1>
              
              <p className="text-xl md:text-2xl mt-6 mb-8 text-foreground/80 max-w-xl">
                Premium, ready-to-customize code solutions to accelerate your development process and enhance your portfolio.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/projects/category/all">
                  <Button size="lg" className="rounded-full px-8 shadow-md hover:shadow-lg transition-all">
                    Browse Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="rounded-full px-8 border-primary/30 hover:border-primary">
                    Become a Creator
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center mt-10 space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-background bg-primary/90 text-white flex items-center justify-center text-sm font-medium`}>
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-sm md:text-base">
                  <span className="font-semibold">1,000+</span> satisfied developers
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block relative"
            >
              <div className="relative">
                <div className="absolute -inset-px bg-gradient-to-r from-primary to-indigo-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="bg-card dark:glass-morphism border border-border rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-6">
                    <div className="h-[350px] w-full bg-accent/50 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Premium code visualized here</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="h-12 bg-accent/30 rounded-md"></div>
                      <div className="h-12 bg-primary/30 rounded-md"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -right-12 -bottom-10 bg-card dark:glass-morphism border border-border p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <div>
                      <p className="font-bold text-lg">4.9/5</p>
                      <p className="text-xs text-muted-foreground">Customer satisfaction</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -left-8 -top-8 bg-card dark:glass-morphism border border-border p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <Download className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-bold text-lg">10k+</p>
                      <p className="text-xs text-muted-foreground">Projects delivered</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover projects across various tech domains and find exactly what you need</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categories.map(category => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link 
                  to={`/projects/category/${category.id}`}
                  className="bg-card border border-border rounded-xl p-6 text-center flex flex-col items-center shadow-sm hover:shadow-md hover:border-primary/30 hover:bg-accent/30 transition-all duration-300"
                >
                  {category.icon}
                  <div className="font-medium text-foreground">{category.name}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-accent/30 dark:bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Handpicked, quality-assured projects that are trending right now</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredProjects.map(project => (
              <motion.div key={project.id} variants={itemVariants}>
                <Link 
                  to={`/projects/${project.id}`}
                  className="bg-card dark:glass-morphism rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                >
                  <div className="relative overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
                      ${project.price}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="text-sm text-primary mb-1">{project.category}</div>
                    <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors duration-300">{project.title}</h3>
                    <div className="flex items-center mt-auto">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 text-sm font-medium text-foreground">{project.rating}</span>
                      </div>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{project.reviews} reviews</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Link to="/projects/category/all">
              <Button className="rounded-full">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Why Choose ByteBazaar</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We provide the best development resources to help you succeed</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30"
              >
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-accent/30 dark:bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Hear from students and developers who have boosted their projects with ByteBazaar</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card dark:glass-morphism p-6 rounded-xl border border-border shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">J</div>
                <div className="ml-3">
                  <div className="font-medium text-foreground">Jason Miller</div>
                  <div className="text-sm text-muted-foreground">Computer Science Student</div>
                </div>
              </div>
              <p className="text-foreground/80">
                "ByteBazaar helped me complete my final year project in half the time. The code was clean, well-documented, and easy to customize."
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card dark:glass-morphism p-6 rounded-xl border border-border shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">S</div>
                <div className="ml-3">
                  <div className="font-medium text-foreground">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground">Frontend Developer</div>
                </div>
              </div>
              <p className="text-foreground/80">
                "The UI templates I purchased saved me weeks of design work. My clients were impressed with the professional look and feel."
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card dark:glass-morphism p-6 rounded-xl border border-border shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center text-violet-600 dark:text-violet-300 font-bold">M</div>
                <div className="ml-3">
                  <div className="font-medium text-foreground">Michael Chang</div>
                  <div className="text-sm text-muted-foreground">Startup Founder</div>
                </div>
              </div>
              <p className="text-foreground/80">
                "ByteBazaar's e-commerce solution helped us launch our MVP in just two weeks. The support team was incredible throughout the process."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/90 to-indigo-500/90 text-white">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Development?</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Join ByteBazaar today and access premium code projects that will take your work to the next level.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="rounded-full bg-white text-primary hover:bg-white/90 px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
