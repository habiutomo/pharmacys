import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface SuccessToastProps {
  title: string;
  description: string;
  onClose?: () => void;
}

export function SuccessToast({ title, description, onClose }: SuccessToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-lg px-4 py-3 flex items-center z-50 animate-in fade-in slide-in-from-bottom">
      <div className="flex-shrink-0 mr-3">
        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
      </div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button 
        className="ml-6 text-gray-400 hover:text-gray-500"
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export default SuccessToast;
