import { useEffect, useState } from 'react'

export const useA2HS = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [canPrompt, setCanPrompt] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanPrompt(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setCanPrompt(false);
    }
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferred prompt since it can only be used once
    setDeferredPrompt(null);
    setCanPrompt(false);
  };

  return {
    canPrompt,
    promptInstall,
  };
}
