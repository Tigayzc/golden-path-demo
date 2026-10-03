// 主页内容 —— 目前全部是占位内容，替换成真实信息即可，无需改动页面代码
// 图片放到 public/images/ 下，然后把 image 字段改成 '/images/xxx.jpg'（深色或纯色背景效果最好）

export const profile = {
  name: 'TIGA',
  eyebrow: "Hi, I'm Tiga",
  tagline: 'I take AI from idea to production.',
  intro: 'AI Application Engineer based in Melbourne.',
  portrait: null, // 例如 '/images/portrait.jpg'
}

export const about = {
  eyebrow: 'About',
  headline: 'Builder on the ground.\nEyes on the sky.',
  body: [
    'AI Application Engineer at AskJoreal, embedding with clients to design and ship custom AI workflows end to end.',
    'Master of IT, UNSW. Based in Melbourne.',
  ],
  image: '/images/about-night.jpg',
}

// 来自简历的真实数据
export const stats = [
  { value: 8, suffix: ' hrs', label: 'Saved per week for a real estate client' },
  { value: 90, suffix: '%', label: 'Less time spent locating materials' },
  { value: 3, suffix: '×', label: 'Faster document upload workflow' },
  { value: 6, suffix: '', label: 'Person team led as Scrum Master' },
]

export const work = [
  {
    eyebrow: 'Project 01',
    title: 'Placeholder project one.',
    description: 'One sentence about what it is and why it matters.',
    image: null,
    gradient: ['#2997ff', '#5e5ce6'],
    link: null,
  },
  {
    eyebrow: 'Project 02',
    title: 'Placeholder project two.',
    description: 'One sentence about what it is and why it matters.',
    image: null,
    gradient: ['#bf5af2', '#ff375f'],
    link: null,
  },
  {
    eyebrow: 'Project 03',
    title: 'Placeholder project three.',
    description: 'One sentence about what it is and why it matters.',
    image: null,
    gradient: ['#ff9f0a', '#ffd60a'],
    link: null,
  },
]

// Know me more —— 换成你自己的照片后效果最好
export const life = [
  {
    eyebrow: 'Photography',
    title: 'Chasing light after dark.',
    description: 'Placeholder — a line about what you love to shoot.',
    image: null,
    gradient: ['#64d2ff', '#0a84ff'],
  },
  {
    eyebrow: 'Cooking',
    title: 'Placeholder headline about cooking.',
    description: 'Placeholder — your signature dish, or why you cook.',
    image: null,
    gradient: ['#ff9f0a', '#ff453a'],
  },
  {
    eyebrow: 'Outdoors',
    title: 'Placeholder headline about the outdoors.',
    description: 'Placeholder — hikes, coastlines, camping trips.',
    image: null,
    gradient: ['#30d158', '#0a84ff'],
  },
  {
    eyebrow: 'Sport',
    title: 'Placeholder headline about sport.',
    description: 'Placeholder — the sports you play and what they teach you.',
    image: null,
    gradient: ['#bf5af2', '#ff375f'],
  },
]

export const shiji = {
  eyebrow: '以史为鉴 · Ask the Grand Historian',
  // 司马迁《报任安书》
  quote: ['究天人之际', '通古今之变', '成一家之言'],
  headline: 'Two thousand years of wisdom.\nYour question today.',
  body: 'Ask a question and get an answer shaped by the thinking of the Records of the Grand Historian.',
}

export const contact = {
  headline: "Let's talk.",
  links: [
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'GitHub', href: 'https://github.com/Tigayzc' },
  ],
}
