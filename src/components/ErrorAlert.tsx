import React from 'react';

interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetry?: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  onRetry, 
  onDismiss, 
  showRetry = true 
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Error de Conexión
          </h3>
          <p className="mt-1 text-sm text-red-700">
            {error}
          </p>
          {(showRetry || onDismiss) && (
            <div className="mt-3 flex space-x-3">
              {showRetry && onRetry && (
                <button
                  onClick={onRetry}
                  className="bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium py-1 px-3 rounded-md transition-colors"
                >
                  Reintentar
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-red-700 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Cerrar
                </button>
              )}
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="flex-shrink-0 ml-3">
            <button
              onClick={onDismiss}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert; 