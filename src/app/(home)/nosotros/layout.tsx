import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conocé la historia de A la Tabla. Somos artesanos apasionados por crear productos únicos en madera, combinando tradición y calidad en cada pieza.',
  keywords: ['sobre nosotros', 'artesanos', 'historia', 'equipo', 'A la Tabla'],
  openGraph: {
    title: 'Sobre Nosotros - A la Tabla',
    description: 'Conocé la historia de A la Tabla y nuestro equipo de artesanos.',
  }
};

export default function NosotrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
