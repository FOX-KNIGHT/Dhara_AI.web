'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { RegistrationMap } from './registration-map';
import { FormEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundary from '../error-boundary';

export function RegisterForm() {
  const { t } = useTranslation();
  const [fieldCoordinates, setFieldCoordinates] = useState<string>('');
  const router = useRouter();
  const { toast } = useToast();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const plotIdInputRef = useRef<HTMLInputElement>(null);


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = nameInputRef.current?.value;
    const email = emailInputRef.current?.value;
    const plotId = plotIdInputRef.current?.value;

    if (name) localStorage.setItem('dharaai_user_name', name);
    if (email) localStorage.setItem('dharaai_user_email', email);
    if (plotId) localStorage.setItem('dharaai_plot_id', plotId);

    // For demonstration, we save to local storage.
    // In a real app, this would be sent to the server.
    if (fieldCoordinates) {
      localStorage.setItem('dharaai_field_coordinates', fieldCoordinates);
      try {
        const coords = JSON.parse(fieldCoordinates);
        if (coords.length > 0) {
          // Save the center of the polygon as the user's location for map centering
          let sumLat = 0, sumLng = 0;
          coords.forEach((coord: { lat: number, lng: number }) => {
            sumLat += coord.lat;
            sumLng += coord.lng;
          });
          const center = { lat: sumLat / coords.length, lng: sumLng / coords.length };
          localStorage.setItem('dharaai_user_location', JSON.stringify(center));
        }
      } catch (error) {
        console.error("Could not parse field coordinates to set user location", error);
      }
    } else {
      // If no field is defined, we can clear old data or use a default
      localStorage.removeItem('dharaai_field_coordinates');
      localStorage.removeItem('dharaai_user_location');
    }

    toast({
      title: "Registration Successful!",
      description: "Your account has been created.",
    });
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="full-name">{t('full_name')}</Label>
          <Input ref={nameInputRef} id="full-name" placeholder="Ram Kumar" required className="bg-transparent" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input ref={emailInputRef} id="email" type="email" placeholder="ram@example.com" required className="bg-transparent" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">{t('password')}</Label>
        <Input id="password" type="password" required className="bg-transparent" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="plot-id">Plot Unique Id</Label>
        <Input ref={plotIdInputRef} id="plot-id" type="text" className="bg-transparent" />
        <p className="text-xs text-muted-foreground">
          Find your plot ID on the Govt. of Odisha land records portal: {' '}
          <a href="https://bhulekh.ori.nic.in/SearchYourPlot.aspx" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            Bhulekh Odisha
          </a>
        </p>
      </div>

      <div className="grid gap-2">
        <Label>{t('define_field_boundary')}</Label>
        <div className="h-96 w-full rounded-lg overflow-hidden border">
          <RegistrationMap onPolygonChange={setFieldCoordinates} />
        </div>
        <Input id="coordinates" type="hidden" value={fieldCoordinates} />
      </div>

      <Button type="submit" className="w-full">
        {t('register')}
      </Button>

      <div className="mt-4 text-center text-sm">
        {t('already_have_account')}{' '}
        <Link href="/login" className="underline">
          {t('login')}
        </Link>
      </div>
    </form>
  );
}
