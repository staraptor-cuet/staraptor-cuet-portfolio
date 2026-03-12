import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#1e1e1e] pt-12 md:pt-16 pb-8 border-t border-gray-sub/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 mb-10 md:mb-12">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-10 h-10 shrink-0">
                <Image src="/images/logo.svg" alt="Staraptor" fill className="object-contain" />
              </div>
              <h3 className="text-primary font-heading font-bold text-lg uppercase leading-tight">
                Team Staraptor CUET
              </h3>
            </div>
            <p className="text-gray-sub text-sm leading-relaxed">
              Engineering the future of vertical flight. Team Staraptor is CUET&apos;s pioneering VTOL UAV research team, developing advanced aerial systems for the METU VTOL Competition and pushing the boundaries of aerospace innovation.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-primary font-heading font-semibold mb-5 md:mb-6">Company</h4>
            <ul className="space-y-3 md:space-y-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'Aircraft', href: '/aircraft' },
                { label: 'VTOL 2026', href: '/vtol-2026' },
                { label: 'Sponsors', href: '/sponsors' },
                { label: 'Crew', href: '/crew' },
                { label: 'Gallery', href: '/gallery' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-sub hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-primary font-heading font-semibold mb-5 md:mb-6">Contact</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-gray-sub leading-relaxed">
              <li>01972723321</li>
              <li>staraptorcuet@gmail.com</li>
              <li>Kaptai, Highway রাউজান<br />পাহাড়তলী সড়ক,<br />Chattogram 4349</li>
            </ul>
            <div className="flex gap-4 mt-6 md:mt-8">
              {[
                { icon: 'linkedin-box-fill.svg', label: 'LinkedIn' },
                { icon: 'instagram-fill.svg', label: 'Instagram' },
                { icon: 'facebook-box-fill.svg', label: 'Facebook' },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="text-primary hover:text-white transition-colors"
                  aria-label={label}
                >
                  <img
                    src={`/icons/${icon}`}
                    alt={label}
                    className="w-6 h-6"
                    style={{ filter: 'brightness(0) saturate(100%) invert(37%) sepia(85%) saturate(1478%) hue-rotate(338deg) brightness(92%) contrast(85%)' }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-sub/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-sub/60">
          <p>© 2026 Team Staraptor CUET. All rights reserved.</p>
          <p>METU VTOL Competition 2026</p>
        </div>
      </div>
    </footer>
  );
}
