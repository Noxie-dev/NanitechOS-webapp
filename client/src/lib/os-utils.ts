// Format time for the top bar clock
export const formatTime = (date: Date, format24h: boolean = false, showSeconds: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !format24h
  };

  if (showSeconds) {
    options.second = '2-digit';
  }

  return date.toLocaleTimeString('en-US', options);
};

// Format date
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

// Generate a unique ID for elements
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Calculate window position based on parent container
export const calculateCenteredPosition = (
  containerWidth: number, 
  containerHeight: number, 
  windowWidth: number, 
  windowHeight: number
): { x: number; y: number } => {
  return {
    x: Math.max(0, (containerWidth - windowWidth) / 2),
    y: Math.max(0, (containerHeight - windowHeight) / 2)
  };
};

// Ensure window stays within viewport
export const constrainToViewport = (
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  viewportWidth: number, 
  viewportHeight: number
): { x: number; y: number } => {
  // Ensure window header is always accessible (at least 30px from the top)
  const constrainedX = Math.min(Math.max(0, x), viewportWidth - Math.min(100, width));
  const constrainedY = Math.min(Math.max(30, y), viewportHeight - Math.min(50, height));
  
  return { x: constrainedX, y: constrainedY };
};

// Check if device is mobile
export const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

// Debounce function for performance optimization
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};
