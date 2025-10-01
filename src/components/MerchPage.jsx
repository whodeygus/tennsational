import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MerchPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">TENNsational Merchandise</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Merchandise store is under development</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We're working on bringing you amazing TENNsational merchandise. 
              Check back soon for updates!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MerchPage;
