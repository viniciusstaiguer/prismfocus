// apps/desktop-electron/src/App.tsx
import { useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAttention } from '../packages/core-sdk/src/useAttention';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null!);

  useAttention(videoRef, {
    onLost: () => {
      toast('⚡ Back to work!');
      new Audio('/alert.wav').play();
      new Audio('/get-back.wav').play();
    },
  });

  return (
    <>
      <video
        ref={videoRef}
        className="fixed bottom-2 right-2 w-32 opacity-20"
        muted
        playsInline
      />
      <Toaster position="top-center" />
    </>
  );
}
