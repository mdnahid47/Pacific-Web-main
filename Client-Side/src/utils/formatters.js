//  BDT Currency Formatter
export const formatBDT = (amount, showDecimals = false) => {
  const num = parseFloat(amount) || 0;
  if (showDecimals) {
    return `৳${num.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `৳${num.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

//  Date Formatter
export const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return date;
  }
};

// DateTime Formatter
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    return `${d.toLocaleDateString('en-BD')} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  } catch (e) {
    return date;
  }
};

// URL Normalizer
export const normalizeUrl = (url) => {
  if (!url) return null;

  const pathMatch = url.match(/(\/uploads\/[^\s"']+)/);
  if (pathMatch) {
    return `https://pacific-web-main-production.up.railway.app${pathMatch[1]}`;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('192.168.')) {
      const cleanPath = url.replace(/https?:\/\/[^\/]+/, '');
      return `https://pacific-web-main-production.up.railway.app${cleanPath}`;
    }
    return url;
  }

  if (url.startsWith('/')) {
    return `https://pacific-web-main-production.up.railway.app${url}`;
  }

  if (url.startsWith('uploads/')) {
    return `https://pacific-web-main-production.up.railway.app/${url}`;
  }

  return `https://pacific-web-main-production.up.railway.app/uploads/${url}`;
};