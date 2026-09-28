/**
 * A floating glass bio card, echoing both references: dericyee's role/location
 * panel and the Floating-island-3D repo's intro card. Placeholder copy for now.
 */
export function BioCard() {
  return (
    <div className="pointer-events-auto absolute right-6 top-24 z-10 hidden w-64 rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md sm:block sm:right-16 sm:top-28">
      <div className="grid grid-cols-2 gap-3 border-b border-white/10 pb-4 text-xs">
        <div>
          <p className="mb-1 tracking-wide text-white/40 uppercase">Role</p>
          <p className="text-white/85">Salesforce Dev</p>
        </div>
        <div>
          <p className="mb-1 tracking-wide text-white/40 uppercase">Rides</p>
          <p className="text-white/85">Batpod</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-white/65">
        Placeholder bio — coder, biker, AI enthusiast. Real copy lands once Fix Things settles the language.
      </p>
    </div>
  )
}
