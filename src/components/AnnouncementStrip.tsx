import React, { useState } from 'react';
import { X, Phone, Clock } from 'lucide-react';
import { StoreConfig } from '../types/store';

interface Props {
  config: StoreConfig;
}

export const AnnouncementStrip: React.FC<Props> = ({ config }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !config.showAnnouncement) {
    return null;
  }

  return (
    <div className="bg-[#143826] text-[#FAF8F5] text-xs py-2 px-4 border-b border-[#1f4e36] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden text-center sm:text-left flex-1 justify-center sm:justify-start">
          <span className="text-[#D49B28] font-medium tracking-wide shrink-0">
            {config.storeName}
          </span>
          <span className="text-[#FAF8F5]/40 shrink-0" aria-hidden="true">·</span>
          <span className="truncate text-[#FAF8F5]/90 font-light">
            {config.announcementText}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[#FAF8F5]/80 shrink-0 text-xs">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D49B28]" />
            <span>Open Today: 8:00 AM – 2:00 PM / 4:30 PM – 9:30 PM</span>
          </span>
          <span className="text-[#FAF8F5]/40" aria-hidden="true">·</span>
          <a
            href={`tel:${config.phone}`}
            className="flex items-center gap-1 text-[#D49B28] hover:underline"
          >
            <Phone className="w-3 h-3" />
            <span>{config.phone}</span>
          </a>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-[#FAF8F5]/60 hover:text-[#FAF8F5] transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
