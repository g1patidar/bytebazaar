import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../branding/Logo';

const Footer = () => {
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
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <Logo size="md" withText={true} className="mb-4" />
            <p className="text-muted-foreground mt-2">Your marketplace for quality code projects and learning resources.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="font-medium text-foreground mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/projects/category/web" className="text-muted-foreground hover:text-primary transition-colors">Web Projects</Link></li>
              <li><Link to="/projects/category/mobile" className="text-muted-foreground hover:text-primary transition-colors">Mobile Apps</Link></li>
              <li><Link to="/projects/category/ai" className="text-muted-foreground hover:text-primary transition-colors">AI Solutions</Link></li>
              <li><Link to="/projects/category/design" className="text-muted-foreground hover:text-primary transition-colors">UI/UX Templates</Link></li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="font-medium text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Support</a></li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="font-medium text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </motion.div>
        </motion.div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} ByteBazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
