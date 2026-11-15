import BirdLoader from '@/components/BirdLoader';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-md pointer-events-auto">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(208, 71, 65, 0.18), transparent 55%)',
        }}
      />
      <BirdLoader />
    </div>
  );
}
