import React, { Suspense } from 'react';
import CallbackClient from './ClientPage';

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackClient />
    </Suspense>
  );
}