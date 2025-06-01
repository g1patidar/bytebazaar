
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailed = () => {
  return (
    <div className="container mx-auto py-8 px-4 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Payment Failed</h1>
        <p className="mb-6">We're sorry, but there was an issue processing your payment. Please try again or contact support for assistance.</p>
        <div className="mt-6">
          <Link to="/checkout" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
