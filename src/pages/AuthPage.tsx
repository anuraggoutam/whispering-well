
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4">
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">WhisperChat</h1>
          <p className="text-muted-foreground">Connect and chat securely</p>
        </div>
        
        <Card className="w-full">
          <CardContent className="pt-6">
            {isLogin ? (
              <LoginForm onToggleForm={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onToggleForm={() => setIsLogin(true)} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
