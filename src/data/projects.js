export const projects = [
  {
    id: 'weather-dashboard',
    slug: 'weather-dashboard',
    title: 'Weather Dashboard',
    subtitle: 'Real-time weather app with beautiful UI',
    description: 'A fully responsive weather dashboard built with React and OpenWeatherMap API. Features include current weather, 5-day forecast, location search, and dynamic backgrounds based on weather conditions.',
    priceInr: 29,
    techStack: ['React', 'CSS3', 'OpenWeatherMap API', 'Geolocation'],
    category: 'Frontend',
    difficulty: 'Beginner',
    demoUrl: null, // Deploy the project on Vercel and paste URL here, e.g. 'https://weather-demo.vercel.app'
    screenshots: [
      'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800',
      'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800',
      'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=800',
    ],
    features: [
      'Real-time weather data',
      '5-day forecast',
      'City search with autocomplete',
      'Dynamic weather backgrounds',
      'Responsive design',
      'Geolocation support',
    ],
    includes: [
      'Complete source code',
      'README with setup guide',
      'Environment config template',
      'Deployment instructions',
    ],
    createdAt: '2026-03-01',
  },
  {
    id: 'expense-tracker',
    slug: 'expense-tracker',
    title: 'Expense Tracker',
    subtitle: 'Track daily expenses with charts & categories',
    description: 'A comprehensive expense tracking application with category-wise breakdown, monthly charts, export to CSV, and budget alerts. Built with Next.js and localStorage for zero-cost hosting.',
    priceInr: 29,
    techStack: ['Next.js', 'Recharts', 'CSS Modules', 'LocalStorage'],
    category: 'Full Stack',
    difficulty: 'Intermediate',
    demoUrl: null,
    screenshots: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    ],
    features: [
      'Add/edit/delete expenses',
      'Category-wise breakdown',
      'Monthly spending charts',
      'Budget limit alerts',
      'Export to CSV',
      'Dark/light theme',
    ],
    includes: [
      'Complete source code',
      'README with setup guide',
      'Sample data included',
      'Deployment guide for Vercel',
    ],
    createdAt: '2026-02-20',
  },
  {
    id: 'portfolio-template',
    slug: 'portfolio-template',
    title: 'Developer Portfolio',
    subtitle: 'Modern portfolio template with animations',
    description: 'A stunning developer portfolio template with smooth scroll animations, project showcase, blog section, contact form, and dark mode. Fully customizable and SEO optimized.',
    priceInr: 19,
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
    category: 'Frontend',
    difficulty: 'Beginner',
    demoUrl: null,
    screenshots: [
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    ],
    features: [
      'Smooth scroll animations',
      'Project showcase grid',
      'Contact form with validation',
      'Dark/light mode toggle',
      'SEO optimized',
      'Mobile responsive',
    ],
    includes: [
      'Complete source code',
      'All assets and icons',
      'Customization guide',
      'Free hosting instructions',
    ],
    createdAt: '2026-02-10',
  },
]

// ============================================================
// HOW TO ADD A NEW PROJECT:
// ============================================================
// 1. Add a new object to the array above following the same structure.
//
// 2. For Live Demo: deploy the project as a separate Vercel app
//    and set demoUrl to its URL (e.g. 'https://my-project.vercel.app').
//    Set to null if no demo is available — the button won't show.
//
// 3. Upload the ZIP to your GitHub private repo:
//    Repo: github.com/{GITHUB_PROJECT_FILES_REPO}
//    Path: my-new-project/my-new-project.zip
//
// 4. Deploy this site — Next.js will auto-generate the new page.
// ============================================================

export const getProjectBySlug = (slug) => {
  return projects.find((p) => p.slug === slug)
}

export const getAllProjects = () => {
  return projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
