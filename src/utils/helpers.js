import { formatDistanceToNow, format, parseISO } from 'date-fns';

export const formatRelativeTime = (dateString) => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown time';
  }
};

export const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMMM dd, yyyy');
  } catch {
    return 'Unknown date';
  }
};

export const formatDateTime = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMMM dd, yyyy • h:mm a');
  } catch {
    return 'Unknown date';
  }
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const generateArticleSlug = (title) => {
  if (!title) return '';
  return encodeURIComponent(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 80)
  );
};

export const getPlaceholderImage = (category = 'general') => {
  const placeholders = {
    general: 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80',
    technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    business: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    sports: 'https://images.unsplash.com/photo-1461896836934-ber627a92d1ab?w=800&q=80',
    entertainment: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&q=80',
    health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
    science: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80',
    world: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  };
  return placeholders[category] || placeholders.general;
};
