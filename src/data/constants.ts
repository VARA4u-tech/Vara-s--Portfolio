// ──────────────────────────────────────
// Single source of truth for all profile data
// ──────────────────────────────────────

export const PROFILE = {
  name: 'Pappuri Durga Vara Prasad',
  shortName: 'Durga Vara Prasad',
  alias: 'Vara',
  title: 'Full Stack Developer',
  email: 'pappuridurgavaraprasad4pl@gmail.com',
  phone: '+919550533315',
  website: 'www.prasad.dev',
  blogHost: 'durgavaraprasad.hashnode.dev',
} as const;

export const SOCIAL_LINKS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/VARA4u-tech',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/durga-vara-prasad-pappuri-1797701b6/',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/d_v_p6/',
  },
  {
    id: 'blog',
    label: 'Blog',
    href: 'https://durgavaraprasad.hashnode.dev/',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:pappuridurgavaraprasad4pl@gmail.com',
  },
] as const;

export type SocialLinkId = (typeof SOCIAL_LINKS)[number]['id'];

/** Helper to get a social link by id */
export const getSocialLink = (id: SocialLinkId) =>
  SOCIAL_LINKS.find((link) => link.id === id)!;
