import React, { useState, useEffect } from 'react';
import { 
  Info,
  Eye, 
  Type, 
  Contrast, 
  Link as LinkIcon, 
  Pause, 
  RotateCcw, 
  Settings,
  X,
  Check,
  ChevronUp
} from 'lucide-react';
import { Card, Button } from './ui';

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  highlightLinks: boolean;
  pauseAnimations: boolean;
}

const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    highContrast: false,
    highlightLinks: false,
    pauseAnimations: false
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  // Save settings to localStorage and apply them
  const updateSettings = (newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  // Apply accessibility settings to the document
  const applySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${settings.fontSize}%`;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('accessibility-high-contrast');
    } else {
      root.classList.remove('accessibility-high-contrast');
    }
    
    // Highlight links
    if (settings.highlightLinks) {
      root.classList.add('accessibility-highlight-links');
    } else {
      root.classList.remove('accessibility-highlight-links');
    }
    
    // Pause animations
    if (settings.pauseAnimations) {
      root.classList.add('accessibility-no-animations');
    } else {
      root.classList.remove('accessibility-no-animations');
    }
  };

  const increaseFontSize = () => {
    const newSize = Math.min(settings.fontSize + 10, 150);
    updateSettings({ ...settings, fontSize: newSize });
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(settings.fontSize - 10, 80);
    updateSettings({ ...settings, fontSize: newSize });
  };

  const toggleHighContrast = () => {
    updateSettings({ ...settings, highContrast: !settings.highContrast });
  };

  const toggleHighlightLinks = () => {
    updateSettings({ ...settings, highlightLinks: !settings.highlightLinks });
  };

  const togglePauseAnimations = () => {
    updateSettings({ ...settings, pauseAnimations: !settings.pauseAnimations });
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 100,
      highContrast: false,
      highlightLinks: false,
      pauseAnimations: false
    };
    updateSettings(defaultSettings);
  };

  return (
    <>
      {/* Accessibility CSS */}
      <style>{`
        .accessibility-high-contrast {
          filter: contrast(150%) brightness(110%);
        }
        
        .accessibility-highlight-links a {
          background-color: yellow !important;
          color: black !important;
          text-decoration: underline !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
        }
        
        .accessibility-no-animations * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `}</style>

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-gradient-to-br from-gold-500 to-warmGold-400 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
          title="נגישות"
          aria-label="פתח תפריט נגישות"
        >
          <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Accessibility Panel */}
        {isOpen && (
          <Card className="absolute bottom-16 right-0 w-72 overflow-hidden shadow-lg border-0">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-gold-500 to-warmGold-400 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Eye className="w-5 h-5" />
                  <h3 className="text-lg font-bold">נגישות</h3>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label={isMinimized ? "הרחב תפריט נגישות" : "כווץ תפריט נגישות"}
                  >
                    <ChevronUp className={`w-5 h-5 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="סגור תפריט נגישות"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {isMinimized && (
                <p className="text-sm text-white/90 mt-2">התאם את האתר לצרכים שלך</p>
              )}
            </div>

            {/* Controls */}
            {!isMinimized && (
              <div className="p-4 space-y-5">
                {/* Font Size */}
                <div>
                  <div className="flex items-center space-x-2 space-x-reverse mb-2">
                    <Type className="w-5 h-5 text-gold-600" />
                    <span className="font-medium text-neutral-800">גודל טקסט</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <button
                      onClick={decreaseFontSize}
                      disabled={settings.fontSize <= 80}
                      className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                      aria-label="הקטן טקסט"
                    >
                      <span className="text-lg font-bold">-</span>
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-sm font-medium text-neutral-700">{settings.fontSize}%</span>
                    </div>
                    <button
                      onClick={increaseFontSize}
                      disabled={settings.fontSize >= 150}
                      className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
                      aria-label="הגדל טקסט"
                    >
                      <span className="text-lg font-bold">+</span>
                    </button>
                  </div>
                </div>

                {/* High Contrast */}
                <div>
                  <button
                    onClick={toggleHighContrast}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      settings.highContrast
                        ? 'border-gold-500 bg-gold-50'
                        : 'border-neutral-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Contrast className="w-5 h-5 text-gold-600" />
                      <span className="font-medium text-neutral-800">ניגודיות גבוהה</span>
                    </div>
                    {settings.highContrast && <Check className="w-5 h-5 text-gold-600" />}
                  </button>
                </div>

                {/* Highlight Links */}
                <div>
                  <button
                    onClick={toggleHighlightLinks}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      settings.highlightLinks
                        ? 'border-gold-500 bg-gold-50'
                        : 'border-neutral-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <LinkIcon className="w-5 h-5 text-gold-600" />
                      <span className="font-medium text-neutral-800">הדגש קישורים</span>
                    </div>
                    {settings.highlightLinks && <Check className="w-5 h-5 text-gold-600" />}
                  </button>
                </div>

                {/* Pause Animations */}
                <div>
                  <button
                    onClick={togglePauseAnimations}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      settings.pauseAnimations
                        ? 'border-gold-500 bg-gold-50'
                        : 'border-neutral-200 hover:border-gold-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Pause className="w-5 h-5 text-gold-600" />
                      <span className="font-medium text-neutral-800">עצור אנימציות</span>
                    </div>
                    {settings.pauseAnimations && <Check className="w-5 h-5 text-gold-600" />}
                  </button>
                </div>

                {/* Reset Button */}
                <div className="pt-3 border-t border-neutral-200">
                  <button
                    onClick={resetSettings}
                    className="w-full flex items-center justify-center space-x-2 space-x-reverse p-2 border border-neutral-300 text-neutral-700 rounded-lg hover:border-gold-300 hover:text-gold-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="font-medium">איפוס הגדרות</span>
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-3 bg-neutral-50 border-t border-neutral-200">
              <p className="text-xs text-neutral-600 text-center">
                ההגדרות נשמרות אוטומטית במכשיר שלך
              </p>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default AccessibilityWidget;