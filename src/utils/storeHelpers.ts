/**
 * Formats a WhatsApp message and generates a click-to-chat URL
 */
export function getWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Checks if the store is currently open based on verified Durg, Chhattisgarh store hours:
 * Monday - Saturday: 09:30 - 20:30 (9:30 AM to 8:30 PM)
 * Sunday: 10:00 - 15:00 (10:00 AM to 3:00 PM)
 */
export function getStoreCurrentStatus(): { isOpen: boolean; label: string; subtext: string } {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTimeVal = hours + minutes / 60;

  if (day === 0) {
    // Sunday: 10:00 AM – 3:00 PM
    if (currentTimeVal >= 10.0 && currentTimeVal < 15.0) {
      return {
        isOpen: true,
        label: 'Open Now (Sunday)',
        subtext: 'Open until 3:00 PM today',
      };
    }
    return {
      isOpen: false,
      label: 'Closed for Sunday',
      subtext: 'Opens Monday morning at 9:30 AM',
    };
  }

  // Monday to Saturday: 9:30 AM - 8:30 PM
  if (currentTimeVal >= 9.5 && currentTimeVal < 20.5) {
    return {
      isOpen: true,
      label: 'Open Now',
      subtext: 'Counter open until 8:30 PM',
    };
  }

  if (currentTimeVal < 9.5) {
    return {
      isOpen: false,
      label: 'Opening Soon',
      subtext: 'Opens this morning at 9:30 AM',
    };
  }

  return {
    isOpen: false,
    label: 'Closed for Tonight',
    subtext: 'Opens tomorrow morning at 9:30 AM',
  };
}
