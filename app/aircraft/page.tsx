import { redirect } from 'next/navigation';

export default function AircraftRedirectPage() {
  redirect('/vtol-2026?model=1#model-1');
}