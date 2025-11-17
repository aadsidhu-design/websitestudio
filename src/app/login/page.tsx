'use client';

import React from 'react';
import { SignInPage, Testimonial } from '@/components/sign-in-page';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
    const { toast } = useToast();

    const heroImage = PlaceHolderImages.find(img => img.id === 'login-hero');

    const testimonials: Testimonial[] = [
        {
            avatarSrc: "https://picsum.photos/seed/1/40/40",
            name: "Alex Rivera",
            handle: "@alex_ux",
            text: "Robin completely changed how I prototype. The speed from idea to interactive app is just unreal.",
        },
        {
            avatarSrc: "https://picsum.photos/seed/2/40/40",
            name: "Samantha Lee",
            handle: "@samdesigns",
            text: "The AI is incredibly intuitive. It feels like having a senior dev partner right next to me.",
        },
        {
            avatarSrc: "https://picsum.photos/seed/3/40/40",
            name: "Casey Jordan",
            handle: "@caseyj",
            text: "I was able to build a fully functional dashboard in a single afternoon. Mind-blowing!",
        },
    ];

    const showToast = (title: string, description: string) => {
        toast({ title, description });
    };

    const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        showToast("Signing In...", `Attempting to sign in as ${email}`);
    };

    return (
        <SignInPage
            heroImageSrc={heroImage?.imageUrl}
            testimonials={testimonials}
            onSignIn={handleSignIn}
            onGoogleSignIn={() => showToast("Google Sign-In", "This feature is not yet implemented.")}
            onResetPassword={() => showToast("Reset Password", "This feature is not yet implemented.")}
            onCreateAccount={() => showToast("Create Account", "This feature is not yet implemented.")}
        />
    );
};

export default LoginPage;
