import React from 'react';

export default function FormError({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
      {message}
    </div>
  );
}
