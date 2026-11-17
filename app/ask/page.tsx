import type { Metadata } from 'next';
import AskClient from './AskClient';

export const metadata: Metadata = {
  title: 'Ask Raptor | Team Staraptor CUET',
  description:
    'Ask Raptor, the AI assistant of Team Staraptor CUET, about the team, the Staraptor VTOL V1 aircraft, the METU VTOL competition, TEKNOFEST, sponsorship and joining.',
};

export default function AskPage() {
  return (
    <div className="bg-background px-3 py-6 sm:px-6 md:py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-label mb-2">AI Assistant</p>
        <h1 className="text-title-main !text-h3 mb-6">Ask Raptor</h1>
        <div className="h-[calc(100dvh-15rem)] min-h-[460px]">
          <AskClient />
        </div>
      </div>
    </div>
  );
}
