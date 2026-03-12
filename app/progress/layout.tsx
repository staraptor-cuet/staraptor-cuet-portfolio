import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drone Development Progress | Staraptor CUET',
  description: 'Follow the development milestones and technical progress of Team Staraptor CUET as they build Bangladesh\'s first student-led VTOL UAV.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
