import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoadingButton({ loading, loadingText, children, ...props }) {
  return (
    <Button className="w-full h-12 font-medium" disabled={loading} {...props}>
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
