'use client';

import { Landing } from '@/components/landing';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePlanGenerated = (message: string, images?: string[]) => {
    // Store the prompt/images and redirect to studio
    sessionStorage.setItem('pendingPrompt', message);
    if (images && images.length > 0) {
      sessionStorage.setItem('pendingImage', images[0]);
    }
    router.push('/studio');
  };

  return (
    <main className="min-h-screen bg-background">
      <Landing
        onPlanGenerated={handlePlanGenerated}
        setIsLoading={setIsLoading}
      />
    </main>
  );
}
