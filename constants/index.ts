// NAVIGATION - Updated for eBay-style navbar

type IconName = "heart" | "mail" | "bell" | "user" | "shopping-cart";
type NavLink = {
  href: string;
  key: string;
  label: string;
  type: 'link' | 'button' | 'icon';
  icon: IconName;
};

export const NAV_LINKS: NavLink[] = [
  { href: '/Sell', key: 'sell', label: 'Sell', type: 'button', icon: 'shopping-cart' },
  { href: '/favorites', key: 'favorites', label: 'Favorites', type: 'link', icon: 'heart' },
  { href: '/Inbox', key: 'inbox', label: 'Inbox', type: 'link', icon: 'mail' },
  { href: '/notifications', key: 'notifications', label: 'Notifications', type: 'link', icon: 'bell' },
  { href: '/profile', key: 'profile', label: 'Profile', type: 'link', icon: 'user' },
];

// MARKETPLACE ITEMS
export const SAMPLE_ITEMS = [
  {
    id: 1,
    name: "Vintage Camera Canon AE-1",
    description: "used for 10 years but kept in good condition",
    category: "electronics",
    price: 99.00,
    image: "/camera.webp",
    location: "New York, NY",
    shipping: "Free shipping",
    condition: "Used - Excellent"
  },
  {
    id: 2,
    name: "MacBook Pro 13-inch M2 2022",
    price: 400.00,
    image: "/macbook.webp",
    location: "San Francisco, CA",
    shipping: "$15.99 shipping",
    condition: "Used - Very Good"
  },
  {
    id: 3,
    name: "Nike Air Jordan 1 Retro High",
    price: 50.50,
    image: "/airjordan.webp",
    location: "Chicago, IL",
    shipping: "Free shipping",
    condition: "New with box"
  },
  {
    id: 4,
    name: "Wooden Coffee Table Handmade",
    price: 100.00,
    image: "/woodentable.webp",
    location: "Austin, TX",
    shipping: "Local pickup only",
    condition: "New"
  },
  {
    id: 5,
    name: "iPhone 14 Pro Max 256GB",
    price: 200.00,
    image: "/iphone14.webp",
    location: "Los Angeles, CA",
    shipping: "Free shipping",
    condition: "Used - Good"
  },
  {
    id: 6,
    name: "Acoustic Guitar Yamaha FG830",
    price: 100.00,
    image: "/guitar.webp",
    location: "Nashville, TN",
    shipping: "$25.00 shipping",
    condition: "Used - Very Good"
  },
  {
    id: 7,
    name: "Gaming Chair",
    price: 42.99,
    image: "/gamingchair.webp",
    location: "Seattle, WA",
    shipping: "Free shipping",
    condition: "New"
  },
  {
    id: 8,
    name: "Vintage Vinyl Record Collection",
    price: 30.00,
    image: "/vinylrecords.webp",
    location: "Detroit, MI",
    shipping: "$12.99 shipping",
    condition: "Used - Good"
  },
  {
    id: 9,
    name: "Mountain Bike Trek X-Caliber",
    price: 150.00,
    image: "/bike.webp",
    location: "Denver, CO",
    shipping: "Local pickup only",
    condition: "Used - Excellent"
  },
  {
    id: 10,
    name: "KitchenAid Stand Mixer",
    price: 30.00,
    image: "/kitchenaid.webp",
    location: "Boston, MA",
    shipping: "Free shipping",
    condition: "Used - Very Good"
  },
  {
    id: 11,
    name: "PlayStation 5 Console",
    price: 199.99,
    image: "/ps5.webp",
    location: "Miami, FL",
    shipping: "$19.99 shipping",
    condition: "New in box"
  },
  {
    id: 12,
    name: "Designer Handbag Coach",
    price: 25.00,
    image: "/handbag.webp",
    location: "Atlanta, GA",
    shipping: "Free shipping",
    condition: "Used - Good"
  }
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