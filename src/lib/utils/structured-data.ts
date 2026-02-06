export interface Organization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
}

export interface Product {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  image: string[];
  brand: {
    '@type': 'Brand';
    name: string;
  };
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
}

export interface BreadcrumbList {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export const generateOrganizationSchema = (): Organization => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://alatabla.store';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'A la Tabla',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Artesanías en madera hechas a mano. Tablas de cortar, utensilios de cocina y decoración artesanal.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
    },
  };
};

export const generateProductSchema = (
  product: {
    name: string;
    description: string;
    images: string[];
    price: number;
    stock: number;
    slug: string;
  }
): Product => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://alatabla.store';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'A la Tabla',
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'ARS',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/productos/${product.slug}`,
    },
  };
};

export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): BreadcrumbList => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://alatabla.store';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
};
