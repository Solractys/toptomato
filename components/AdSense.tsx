import Script from "next/script";

const AdSense = () => {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9030427245078103"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};
export default AdSense;
