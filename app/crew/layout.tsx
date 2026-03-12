import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Team | Staraptor CUET UAV Team',
  description: 'Meet the passionate engineering students behind Team Staraptor CUET, developing advanced VTOL UAV systems for international competitions.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
