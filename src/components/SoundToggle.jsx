import { ui } from '../content'
import { useSound } from '../lib/sound'
import { SpeakerIcon } from './icons'

export default function SoundToggle() {
  const { enabled, toggle } = useSound()
  const label = enabled ? ui.soundOff : ui.soundOn
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={label}
      title={label}
      className="fixed right-4 top-4 z-[64] grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-ivory/75 text-rose-deep shadow-[0_10px_26px_-14px_rgba(71,53,47,0.55)] backdrop-blur-md transition-colors duration-300 hover:bg-ivory sm:right-6 sm:top-6"
    >
      <SpeakerIcon on={enabled} className="h-[1.2rem] w-[1.2rem]" />
    </button>
  )
}
