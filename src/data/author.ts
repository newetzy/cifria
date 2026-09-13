export const author = {
  name: 'Carlos Medina González',
  url: 'https://cifria.es/autor/carlos/',
  path: '/autor/carlos/',
} as const;

export const authorSchema = {
  '@type': 'Person',
  name: author.name,
  url: author.url,
} as const;

export const organizationSchema = {
  '@type': 'Organization',
  name: 'Cifria',
  url: 'https://cifria.es/',
  logo: {
    '@type': 'ImageObject',
    url: 'https://cifria.es/favicon.svg',
  },
  founder: authorSchema,
} as const;
