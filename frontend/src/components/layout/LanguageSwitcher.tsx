import { motion } from 'motion/react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../utils/i18n';

export function LanguageSwitcher() {
  const { lang, changeLanguage } = useLanguage();

  const options = [
    { code: 'id' as const, label: 'Bahasa', flag: '🇮🇩' },
    { code: 'en' as const, label: 'English', flag: '🇺🇸' },
  ];

  const currentActive = lang === 'en' ? 'en' : 'id';

  return (
    <>
      {/* Mobile Toggle Button (Single Compact Option for Viewports < sm) */}
      <button
        type="button"
        onClick={() => changeLanguage(lang === 'en' ? 'id' : 'en')}
        className="sm:hidden flex items-center justify-center gap-1.5 w-32 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none focus:outline-none flex-shrink-0"
        title={lang === 'en' ? "Switch to Bahasa Indonesia" : "Switch to English"}
      >
        <span className="text-sm">{lang === 'en' ? '🇺🇸' : '🇮🇩'}</span>
        <span className="text-[11px] font-bold">{lang === 'en' ? 'English' : 'Indo'}</span>
      </button>

      {/* Desktop Toggle (Slider Pill for Viewports >= sm) */}
      <div 
        id="language-switcher-container" 
        className="hidden sm:inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700 shadow-sm gap-1 relative z-10 w-40 lg:w-44 h-9 flex-shrink-0"
      >
        <Globe id="language-switcher-icon" className="w-3.5 h-3.5 text-blue-500 ml-1 hidden lg:inline" />
        <div id="language-switcher-buttons" className="flex flex-1 gap-1 relative h-full">
          {options.map((opt) => {
            const isActive = currentActive === opt.code;
            return (
              <button
                id={`lang-btn-${opt.code}`}
                key={opt.code}
                onClick={() => changeLanguage(opt.code)}
                className="relative flex-1 h-full text-xs font-bold rounded-lg transition-colors cursor-pointer select-none focus:outline-none flex items-center gap-1 z-10 justify-center border-0 bg-transparent"
                type="button"
              >
                {isActive && (
                  <motion.div
                    id={`lang-active-indicator-${opt.code}`}
                    layoutId="activeLanguagePill"
                    className="absolute inset-0 bg-blue-600 rounded-lg -z-10 shadow-sm"
                    transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
                <span id={`lang-flag-${opt.code}`} className="text-xs">{opt.flag}</span>
                <span 
                  id={`lang-label-${opt.code}`} 
                  className={`text-[11px] font-bold transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
