// 主页内容 —— 目前全部是占位内容，替换成真实信息即可，无需改动页面代码
// 图片放到 public/images/ 下，然后把 image 字段改成 '/images/xxx.jpg'（深色或纯色背景效果最好）

export const profile = {
  name: 'TIGA',
  eyebrow: "Hi, I'm Tiga",
  tagline: 'Learn from the past. Build what is next.',
  intro: 'Engineer, builder, and student of history.',
  portrait: null, // 例如 '/images/portrait.jpg'
}

export const about = {
  eyebrow: 'About',
  headline: 'Engineer by trade.\nHistorian at heart.',
  body: [
    'Placeholder — a short introduction about who you are, what you do, and what drives you.',
    'Placeholder — a second line about your background, your current focus, or where you are based.',
  ],
}

export const stats = [
  { value: 8, suffix: '+', label: 'Years building software' },
  { value: 30, suffix: '+', label: 'Projects shipped' },
  { value: 3, suffix: '', label: 'Countries lived in' },
  { value: 130, suffix: '', label: 'Chapters of Shiji read' },
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
