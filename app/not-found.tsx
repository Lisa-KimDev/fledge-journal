import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="day-numeral font-serif text-7xl font-semibold text-[#E8B24A]/30">404</p>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-[#F4EFE6]">
        This feather hasn&apos;t hatched.
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#8A857A]">
        The page you&apos;re looking for doesn&apos;t exist — or the episode
        hasn&apos;t been written yet.
      </p>
      <div className="mt-8 flex items-center justify-center gap-6 text-sm">
        <Link href="/" className="font-medium text-[#E8B24A] hover:text-[#F4EFE6]">
          Home
        </Link>
        <Link href="/journal" className="font-medium text-[#E8B24A] hover:text-[#F4EFE6]">
          Read the journal
        </Link>
      </div>
    </div>
  );
}
