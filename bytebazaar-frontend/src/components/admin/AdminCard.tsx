import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AdminCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  description,
  icon,
  children,
  footer,
  className,
  contentClassName
}) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md dark:hover:shadow-primary/5",
        "border border-border/40 dark:border-border/20",
        "bg-card dark:bg-card/95",
        className
      )}
    >
      {(title || description) && (
        <CardHeader>
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="flex-shrink-0 p-2 bg-primary/10 dark:bg-primary/20 rounded-lg transition-colors">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <CardTitle className="text-foreground transition-colors">
                  {title}
                </CardTitle>
              )}
              {description && (
                <CardDescription className="text-muted-foreground transition-colors">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={cn("transition-colors", contentClassName)}>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="border-t border-border/40 dark:border-border/20 transition-colors">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default AdminCard; 