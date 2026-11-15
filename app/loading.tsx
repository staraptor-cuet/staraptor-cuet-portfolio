import BirdLoader from '@/components/BirdLoader';

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-auto"
      style={{
        background: 'radial-gradient(circle at 50% 46%, rgba(109, 23, 20, 0.16), transparent 36%), #151313',
      }}
    >
      <BirdLoader />
    </div>
  );
}
