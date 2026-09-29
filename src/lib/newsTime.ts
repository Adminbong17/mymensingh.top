// ============================================================================
// News Time Formatter (Real-time relative time within 24 hours)
// e.g., "এইমাত্র", "১০ মিনিট আগে", "১ ঘণ্টা আগে", "৫ ঘণ্টা আগে"
// After 24 hours, automatically falls back to standard date (e.g. "২৯ সেপ্টেম্বর, ২০২৬")
// ============================================================================

export function formatNewsTimeDisplay(createdAt?: string, fallbackDate?: string): {
  isWithin24h: boolean;
  timeAgoText: string;
  displayDate: string;
} {
  const toBn = (n: number) =>
    n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);

  if (!createdAt) {
    return {
      isWithin24h: false,
      timeAgoText: '',
      displayDate: fallbackDate || '',
    };
  }

  const createdTime = new Date(createdAt).getTime();
  if (isNaN(createdTime)) {
    return {
      isWithin24h: false,
      timeAgoText: '',
      displayDate: fallbackDate || '',
    };
  }

  const now = Date.now();
  const diffMs = now - createdTime;

  // Handle minor clock skew (up to 1 min in future)
  if (diffMs < 0 && diffMs > -60000) {
    return {
      isWithin24h: true,
      timeAgoText: 'এইমাত্র',
      displayDate: 'এইমাত্র',
    };
  }

  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMinutes / 60);

  // Within 24 hours: show real-time relative time
  if (diffHours < 24 && diffMinutes >= 0) {
    let text = '';
    if (diffMinutes < 1) {
      text = 'এইমাত্র';
    } else if (diffMinutes < 60) {
      text = `${toBn(diffMinutes)} মিনিট আগে`;
    } else if (diffHours === 1) {
      text = '১ ঘণ্টা আগে';
    } else {
      text = `${toBn(diffHours)} ঘণ্টা আগে`;
    }

    return {
      isWithin24h: true,
      timeAgoText: text,
      displayDate: text,
    };
  }

  // After 24 hours: do NOT show "X ঘণ্টা আগে", show regular date
  return {
    isWithin24h: false,
    timeAgoText: '',
    displayDate: fallbackDate || '',
  };
}
