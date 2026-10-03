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
    'AI Application Engineer who works directly with clients to design and ship custom AI workflows end to end.',
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

// Know me more —— 一段总体介绍 + 可滑动的照片画廊
export const life = {
  eyebrow: 'Know me more',
  headline: 'Life beyond\nthe terminal.',
  body: 'An ENTJ who plans the route — then walks it. Away from the keyboard I play sport, hike and camp under the stars, chase light with a camera, and cook things that take all afternoon.',
  photos: [
    { src: '/images/life/tent.jpg', alt: 'Arms wide open in front of a glowing tent under the stars' },
    { src: '/images/life/ridge.jpg', alt: 'Hiker with a backpack looking over forested ridges' },
    { src: '/images/life/coast.jpg', alt: 'Waves rolling onto a sunlit sand bar' },
    { src: '/images/life/wellington.jpg', alt: 'Home-made Beef Wellington with jus and rocket' },
    { src: '/images/life/boardwalk.jpg', alt: 'Boardwalk through a grassy wetland below a forested hill' },
    { src: '/images/life/lake.jpg', alt: 'Lakeside house reflected in still water with misty mountains behind' },
  ],
}

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
