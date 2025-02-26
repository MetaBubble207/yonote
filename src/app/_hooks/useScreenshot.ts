import { useState, useRef } from 'react';
import { domToPng } from 'modern-screenshot';

export const useScreenshot = () => {
  const png = useRef(null);
  const [pngUrl, setPngUrl] = useState<string>("");
  const [isScreenshot, setScreenshot] = useState(false);

  const handleScreenshotClick = async () => {
    try {
      setScreenshot(true);
      const dataUrl = await domToPng(png.current!, {
        scale: 2,
        quality: 1,
      });
      setPngUrl(dataUrl);
      setScreenshot(false);
    } catch (error) {
      alert("无法截图，请重试。");
      setScreenshot(false);
    }
  };

  return {
    png,
    pngUrl,
    isScreenshot,
    handleScreenshotClick
  };
};