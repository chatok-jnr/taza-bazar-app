import { useState, FormEvent, ChangeEvent } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface AdminData {
  _id: string;
  name: string;
  email: string;
  phone_no: string;
  date_of_birth: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface LoginResponse {
  status: string;
  message: string;
  token: string;
  data: AdminData;
}

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/admin/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        if (response.status === 500) {
          setError('Server error. Please check if the server is running at http://127.0.0.1:8000');
          console.error('Server error occurred');
        } else {
          const errorData = await response.json();
          setError(errorData.message || `Error: ${response.status} - ${response.statusText}`);
          console.error('Login error:', errorData);
        }
        setIsLoading(false);
        return;
      }

      const data: LoginResponse = await response.json();

      if (data.status === 'success') {
        // Store the token in localStorage for future authenticated requests
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.data));
        // Call the onLogin callback with the user data
        onLogin(data.data.email, data.token);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please check if the server is running and try again.');
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl neon-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl cyan-glow" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 neon-glow mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-primary mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Marketplace Control Center</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 bg-card neon-border backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@marketplace.com"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="pl-10 bg-input-background border-border focus:border-primary transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-input-background border-border focus:border-primary transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-destructive/20 border border-destructive/30">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border-primary/30 neon-glow-sm transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Secure Admin Access • Protected by End-to-End Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
