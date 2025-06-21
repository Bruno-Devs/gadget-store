import {
  Search,
  ShoppingCart,
  User,
  Home,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  Heart,
  Share2,
  Plus,
  Minus,
  Trash,
  Settings,
  LogOut,
  Package,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  type LucideIcon,
  type LucideProps
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  search: Search,
  cart: ShoppingCart,
  user: User,
  home: Home,
  menu: Menu,
  close: X,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  star: Star,
  heart: Heart,
  share: Share2,
  add: Plus,
  remove: Minus,
  trash: Trash,
  settings: Settings,
  logout: LogOut,
  package: Package,
  creditCard: CreditCard,

  // Contact
  mail: Mail,
  phone: Phone,
  location: MapPin,
} as const;

export type IconName = keyof typeof Icons;

interface IconComponentProps extends LucideProps {
  name: IconName;
}

export function Icon({ name, ...props }: IconComponentProps) {
  const IconComponent = Icons[name];
  return <IconComponent {...props} />;
} 