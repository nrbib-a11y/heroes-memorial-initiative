import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Edit,
  FileText,
  Flame,
  Heart,
  Image,
  Info,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Map,
  MapPin,
  MessageSquare,
  Paperclip,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Star,
  Trash2,
  Upload,
  User,
  Users,
  X,
  LucideProps,
} from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
  fallback?: string;
}

const iconMap: Record<string, React.FC<LucideProps>> = {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Edit,
  FileText,
  Flame,
  Heart,
  Image,
  Info,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Map,
  MapPin,
  MessageSquare,
  Paperclip,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Star,
  Trash2,
  Upload,
  User,
  Users,
  X,
};

const Icon: React.FC<IconProps> = ({ name, fallback = 'CircleAlert', ...props }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    const FallbackIcon = iconMap[fallback];

    if (!FallbackIcon) {
      return <span className="text-xs text-gray-400">[icon]</span>;
    }

    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
};

export default Icon;
