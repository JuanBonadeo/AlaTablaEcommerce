import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Ponete en contacto con A la Tabla. Estamos aquí para ayudarte con tus consultas sobre nuestros productos artesanales en madera.',
  keywords: ['contacto', 'consultas', 'atención al cliente', 'A la Tabla'],
  openGraph: {
    title: 'Contacto - A la Tabla',
    description: 'Ponete en contacto con nosotros. Estamos para ayudarte.',
  }
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
