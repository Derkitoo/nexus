'use client';

import React from 'react';
import { Compass, Navigation, Zap, Flame, User, BookOpen } from 'lucide-react';
import { soundFX } from '@/utils/audioFeedback';

export type AppleTab = 'explore' | 'techniques' | 'gps' | 'drill' | 'journal';

interface AppleTabBarProps {
  currentTab: AppleTab;
  onChangeTab: (tab: AppleTab) => void;
  isGPSActive: boolean;
}

export const AppleTabBar: React.FC<AppleTabBarProps> = ({
  currentTab,
  onChangeTab,
  isGPSActive,
}) => {
  const tabs = [
    {
      id: 'explore' as AppleTab,
      label: 'Itinéraires',
      icon: Compass,
    },
    {
      id: 'techniques' as AppleTab,
      label: 'Techniques',
      icon: BookOpen,
    },
    {
      id: 'gps' as AppleTab,
      label: 'GPS Flow',
      icon: Navigation,
    },
    {
      id: 'drill' as AppleTab,
      label: 'Fight IQ',
      icon: Zap,
    },
    {
      id: 'journal' as AppleTab,
      label: 'Journal',
      icon: Flame,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-[460px] mx-auto">
      {/* Apple iOS Frosted UITabBar Container */}
      <div className="ios-glass-sheet pt-2 pb-1 px-3 border-t border-white/12 shadow-[0_-8px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFX.playClick();
                  onChangeTab(tab.id);
                }}
                className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-90 relative ${
                  isActive ? 'text-[#0a84ff]' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'
                    }`}
                  />
                  {tab.id === 'gps' && isGPSActive && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30d158] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30d158]"></span>
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] mt-1 font-medium tracking-tight ${
                    isActive ? 'font-bold text-[#0a84ff]' : 'text-white/50'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Apple iOS Home Indicator Bar */}
        <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-1" />
      </div>
    </nav>
  );
};
