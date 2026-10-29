import {
  BedDouble,
  Briefcase,
  Bus,
  CloudSun,
  Hand,
  Hash,
  Landmark,
  Luggage,
  MapPin,
  MessagesSquare,
  Mountain,
  Plane,
  Shuffle,
  Trophy,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  hand: Hand,
  messages: MessagesSquare,
  hash: Hash,
  map: MapPin,
  wallet: Wallet,
  bed: BedDouble,
  utensils: UtensilsCrossed,
  plane: Plane,
  luggage: Luggage,
  bus: Bus,
  landmark: Landmark,
  cloud: CloudSun,
  trophy: Trophy,
  briefcase: Briefcase,
  mountain: Mountain,
  shuffle: Shuffle,
};

export function TopicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Shuffle;
  return <Icon className={className} strokeWidth={2.25} aria-hidden="true" />;
}
