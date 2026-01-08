import { useTranslation } from 'react-i18next';

/**
 * Hook to detect RTL/LTR based on current language
 */
export const useRTL = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'he' || i18n.language === 'ar';

  return { isRTL };
};
