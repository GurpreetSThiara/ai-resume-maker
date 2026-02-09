
import ImageConverter from './ImageConverter'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Image Format Converter - PNG, JPG, WebP, BMP, GIF | No Upload Required',
  description: 'Convert your images instantly — no software install, no server uploads, and no privacy worries. Transform between PNG, JPG, WebP, BMP, and GIF formats with our fast, secure browser-based converter.',
  keywords: [
    'image converter',
    'png to jpg',
    'jpg to png',
    'webp converter',
    'image format converter',
    'free image converter',
    'online image converter',
    'no upload image converter',
    'batch image converter',
    'png converter',
    'jpg converter',
    'bmp converter',
    'gif converter',
    'image format conversion',
    'browser image converter',
    'client-side image converter'
  ],
  openGraph: {
    title: 'Free Image Format Converter - No Upload Required',
    description: 'Convert images between PNG, JPG, WebP, BMP, GIF formats instantly in your browser. 100% private, fast, and free.',
    type: 'website',
    images: [{
      url: '/og-image-converter.jpg',
      width: 1200,
      height: 630,
      alt: 'Image Format Converter Tool'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Image Format Converter',
    description: 'Convert images instantly in your browser. No uploads, no software, 100% private.',
    images: ['/twitter-image-converter.jpg']
  }
};

const page = () => {
  return (
    <div>
      <ImageConverter/>
    </div>
  )
}

export default page
