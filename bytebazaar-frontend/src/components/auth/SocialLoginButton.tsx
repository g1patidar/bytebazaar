
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface SocialLoginButtonProps {
  provider: 'google' | 'facebook';
  className?: string;
}

// This is just a placeholder since we don't have actual social login implemented
// In a real app, you would connect to the OAuth providers
const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, className }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleSocialLogin = async () => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual OAuth flow
      toast.info(`${provider} login is not implemented in this demo.`);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show message
      toast.info(`To implement ${provider} login, you need to set up OAuth.`);
    } catch (error: any) {
      toast.error(`Error with ${provider} login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full flex items-center justify-center ${className}`}
      onClick={handleSocialLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : (
        <>
          {provider === 'google' ? (
            <>
              <div className="mr-2 h-4 w-4 text-red-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.057-1.03-.163-1.525z" />
                </svg>
              </div>
              Continue with Google
            </>
          ) : (
            <>
              <div className="mr-2 h-4 w-4 text-blue-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                </svg>
              </div>
              Continue with Facebook
            </>
          )}
        </>
      )}
    </Button>
  );
};

export default SocialLoginButton;
