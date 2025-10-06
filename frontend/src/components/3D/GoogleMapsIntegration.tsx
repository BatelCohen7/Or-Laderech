import React, { useState } from 'react';

interface GoogleMapsIntegrationProps {
  address: string;
  className?: string;
}

declare global {
  interface Window {
    initMap: () => void;
    initMapCallback?: () => void;
    google: any;
  }
}

const GoogleMapsIntegration: React.FC<GoogleMapsIntegrationProps> = ({ address, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simulate loading for a moment
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-neutral-100 rounded-xl border border-neutral-200 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-navy-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">טוען מפה תלת-ממדית...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-neutral-100 rounded-xl border border-neutral-200 ${className}`}>
        <div className="text-center p-4">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">שגיאה בטעינת המפה</h3>
          <p className="text-neutral-600">{error}</p>
          <p className="text-sm text-neutral-500 mt-4">
            הערה: מצב דמו - מציג תצוגה לדוגמה בלבד
          </p>
        </div>
      </div>
    );
  }

  // Mock map display for demo mode
  return (
    <div 
      className={`w-full h-full min-h-[400px] rounded-xl border border-neutral-200 ${className} relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-neutral-200">
        <img 
          src="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Map view"
          className="w-full h-full object-cover opacity-80"
        />
      </div>
      
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
        <div className="font-medium text-neutral-800 mb-1">{address}</div>
        <div className="text-xs text-neutral-600">מצב דמו - מפה לדוגמה</div>
      </div>
      
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
        <div className="font-medium text-neutral-800">מצב תלת-ממדי</div>
      </div>
    </div>
  );
};

export default GoogleMapsIntegration;