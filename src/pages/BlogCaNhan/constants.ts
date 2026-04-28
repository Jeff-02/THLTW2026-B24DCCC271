import type { AuthorInfo } from './types';

export const AUTHOR_INFO: AuthorInfo = {
  name: 'Nguyễn Đức Trường',
  avatar: 'https://via.placeholder.com/150',
  bio: 'Lập trình viên Full Stack với niềm đam mê xây dựng các ứng dụng web hiệu suất cao và trải nghiệm người dùng tuyệt vời.',
  skills: [
    'React',
    'TypeScript',
    'Node.js',
    'Python',
    'AWS',
    'Docker',
    'MongoDB',
    'PostgreSQL',
    'GraphQL',
    'REST API'
  ],
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    facebook: 'https://facebook.com',
    email: 'your-email@example.com'
  }
};

export const DEFAULT_TAGS = [
  { id: '1', name: 'Công nghệ', color: '#1890ff' },
  { id: '2', name: 'Cuộc sống', color: '#52c41a' },
  { id: '3', name: 'Du lịch', color: '#faad14' },
  { id: '4', name: 'Sức khỏe', color: '#f5222d' },
  { id: '5', name: 'Giáo dục', color: '#722ed1' }
];

export const BLOG_STORAGE_KEY = 'blogCaNhanBlogs';
export const TAGS_STORAGE_KEY = 'blogCaNhanTags';
export const AUTHOR_STORAGE_KEY = 'blogCaNhanAuthor';

export const ITEMS_PER_PAGE = 9; // Phân trang 9 bài/trang
export const DEBOUNCE_DELAY = 300; // Tìm kiếm với debounce 300ms

export const BLOG_STATUS_OPTIONS = [
  { label: 'Nháp', value: 'Nháp' },
  { label: 'Công khai', value: 'Công khai' },
  { label: 'Ẩn', value: 'Ẩn' }
];

export const BLOG_STATUS_COLORS: Record<string, string> = {
  'Nháp': '#d9d9d9',
  'Công khai': '#52c41a',
  'Ẩn': '#ff7875'
};
