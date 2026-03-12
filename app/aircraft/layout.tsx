import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VTOL Aircraft Design | Team Staraptor CUET',
  description: 'Explore the technical specifications and engineering design of the Staraptor VTOL aircraft, a cutting-edge UAV developed by CUET students.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
