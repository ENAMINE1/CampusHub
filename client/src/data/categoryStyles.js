// An icon and a soft cover gradient per event category, so events without a poster still get a
// recognisable, consistent image. Gradients stay inside one hue family to keep the palette calm.
import {
  Briefcase,
  Code,
  Drama,
  Hammer,
  PartyPopper,
  Sparkles,
  Trophy,
} from 'lucide-react';

const categoryStyles = {
  tech: { icon: Code, cover: 'from-indigo-500 to-violet-500' },
  cultural: { icon: Drama, cover: 'from-fuchsia-500 to-rose-400' },
  sports: { icon: Trophy, cover: 'from-emerald-500 to-teal-400' },
  workshop: { icon: Hammer, cover: 'from-amber-500 to-orange-400' },
  career: { icon: Briefcase, cover: 'from-sky-500 to-cyan-400' },
  social: { icon: PartyPopper, cover: 'from-pink-500 to-orange-300' },
  other: { icon: Sparkles, cover: 'from-slate-500 to-slate-400' },
};

export default function styleForCategory(category) {
  return categoryStyles[category] ?? categoryStyles.other;
}
