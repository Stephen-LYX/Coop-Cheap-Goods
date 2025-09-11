// NAVIGATION - Updated for eBay-style navbar
export const NAV_LINKS = [
  { href: '/sell', key: 'sell', label: 'Sell', type: 'button' },
  { href: '/favorites', key: 'favorites', label: 'Favorites', type: 'icon', icon: 'heart' },
  { href: '/inbox', key: 'inbox', label: 'Inbox', type: 'icon', icon: 'mail' },
  { href: '/notifications', key: 'notifications', label: 'Notifications', type: 'icon', icon: 'bell' },
  { href: '/profile', key: 'profile', label: 'Profile', type: 'icon', icon: 'user' },
  { href: '/cart', key: 'cart', label: 'Cart', type: 'icon', icon: 'shopping-cart' },
  { href: '/login', key: 'login', label: 'Login', type: 'icon', icon: 'profile' },
];

// CAMP SECTION
export const PEOPLE_URL = [
  '/person-1.png',
  '/person-2.png',
  '/person-3.png',
  '/person-4.png',
];

// FEATURES SECTION
export const FEATURES = [
  {
    title: 'Real maps can be offline',
    icon: '/map.svg',
    variant: 'green',
    description:
      'We provide a solution for you to be able to use our application when climbing, yes offline maps you can use at any time there is no signal at the location',
  },
  {
    title: 'Set an adventure schedule',
    icon: '/calendar.svg',
    variant: 'green',
    description:
      "Schedule an adventure with friends. On holidays, there are many interesting offers from Hilink. That way, there's no more discussion",
  },
  {
    title: 'Technology using augment reality',
    icon: '/tech.svg',
    variant: 'green',
    description:
      'Technology uses augmented reality as a guide to your hiking trail in the forest to the top of the mountain. Already supported by the latest technology without an internet connection',
  },
  {
    title: 'Many new locations every month',
    icon: '/location.svg',
    variant: 'orange',
    description:
      'Lots of new locations every month, because we have a worldwide community of climbers who share their best experiences with climbing',
  },
];

// FOOTER SECTION
export const FOOTER_LINKS = [
  {
    title: 'Learn More',
    links: [
      'About Hilink',
      'Press Releases',
      'Environment',
      'Jobs',
      'Privacy Policy',
      'Contact Us',
    ],
  },
  {
    title: 'Our Community',
    links: ['Climbing xixixi', 'Hiking hilink', 'Hilink kinthill'],
  },
];

export const FOOTER_CONTACT_INFO = {
  title: 'Contact Us',
  links: [
    { label: 'Admin Officer', value: '123-456-7890' },
    { label: 'Email Officer', value: 'hilink@akinthil.com' },
  ],
};

export const SOCIALS = {
  title: 'Social',
  links: [
    '/facebook.svg',
    '/instagram.svg',
    '/twitter.svg',
    '/youtube.svg',
    '/wordpress.svg',
  ],
};