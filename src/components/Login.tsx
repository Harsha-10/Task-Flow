import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Bug className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
          <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">TaskFlow</h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Sign in to your account</p>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1 sm:space-y-2">
            <CardTitle className="text-xl sm:text-2xl">Welcome back</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="username" className="text-sm sm:text-base">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="h-9 sm:h-10"
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-xs sm:text-sm">
                  <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-9 sm:h-10 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-sm text-gray-600">
                <p className="font-medium">Demo Accounts:</p>
                <div className="mt-2 space-y-1">
                  <p><strong>Developer:</strong> dev1 / password</p>
                  <p><strong>Manager:</strong> manager1 / password</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
