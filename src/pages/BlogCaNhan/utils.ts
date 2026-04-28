import type { Blog, Tag } from './types';
import { BLOG_STORAGE_KEY, TAGS_STORAGE_KEY, AUTHOR_STORAGE_KEY, DEFAULT_TAGS, AUTHOR_INFO } from './constants';

// ============ Blog Storage ============
export const loadBlogs = (): Blog[] => {
  try {
    const value = localStorage.getItem(BLOG_STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

export const saveBlogs = (blogs: Blog[]): void => {
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(blogs));
};

export const getBlogBySlug = (slug: string): Blog | undefined => {
  const blogs = loadBlogs();
  return blogs.find(blog => blog.slug === slug);
};

export const getPublishedBlogs = (): Blog[] => {
  return loadBlogs().filter(blog => blog.status === 'Công khai');
};

// ============ Tags Storage ============
export const saveTags = (tags: Tag[]): void => {
  localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
};

export const loadTags = (): Tag[] => {
  try {
    const value = localStorage.getItem(TAGS_STORAGE_KEY);
    if (!value) {
      // Nếu chưa có tags, khởi tạo với DEFAULT_TAGS
      saveTags(DEFAULT_TAGS);
      return DEFAULT_TAGS;
    }
    return JSON.parse(value);
  } catch {
    return DEFAULT_TAGS;
  }
};

export const getTagById = (id: string): Tag | undefined => {
  const tags = loadTags();
  return tags.find(tag => tag.id === id);
};

export const getTagsByIds = (ids: string[]): Tag[] => {
  const tags = loadTags();
  return tags.filter(tag => ids.includes(tag.id));
};

// ============ Author Storage ============
export const loadAuthorInfo = () => {
  try {
    const value = localStorage.getItem(AUTHOR_STORAGE_KEY);
    return value ? JSON.parse(value) : AUTHOR_INFO;
  } catch {
    return AUTHOR_INFO;
  }
};

export const saveAuthorInfo = (author: typeof AUTHOR_INFO): void => {
  localStorage.setItem(AUTHOR_STORAGE_KEY, JSON.stringify(author));
};

// ============ Slug generation ============
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const isSlugUnique = (slug: string, excludeId?: string): boolean => {
  const blogs = loadBlogs();
  return !blogs.some(blog => blog.slug === slug && blog.id !== excludeId);
};

// ============ Search & Filter ============
export const searchBlogs = (
  blogs: Blog[],
  query: string,
  tagIds?: string[],
  status?: string
): Blog[] => {
  return blogs.filter(blog => {
    const matchSearch = !query || 
      blog.title.toLowerCase().includes(query.toLowerCase()) ||
      blog.content.toLowerCase().includes(query.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(query.toLowerCase());
    
    const matchTags = !tagIds || tagIds.length === 0 ||
      tagIds.some(tagId => blog.tags.includes(tagId));
    
    const matchStatus = !status || blog.status === status;
    
    return matchSearch && matchTags && matchStatus;
  });
};

// ============ Pagination ============
export const paginate = <T,>(items: T[], page: number, pageSize: number): T[] => {
  const startIndex = (page - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};

export const getTotalPages = (itemCount: number, pageSize: number): number => {
  return Math.ceil(itemCount / pageSize);
};

// ============ Date Formatting ============
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// ============ Other Utilities ============
export const incrementViewCount = (slug: string): void => {
  const blogs = loadBlogs();
  const blog = blogs.find(b => b.slug === slug);
  if (blog) {
    blog.views += 1;
    blog.updateDate = new Date().toISOString();
    saveBlogs(blogs);
  }
};

export const getRelatedBlogs = (currentBlog: Blog, limit: number = 3): Blog[] => {
  const allBlogs = getPublishedBlogs();
  
  // Lọc bài viết cùng tag, không kể bài hiện tại
  const related = allBlogs
    .filter(blog => 
      blog.id !== currentBlog.id &&
      blog.tags.some(tag => currentBlog.tags.includes(tag))
    )
    .sort((a, b) => {
      // Sắp xếp theo số tag trùng khớp, giảm dần
      const aMatches = a.tags.filter(tag => currentBlog.tags.includes(tag)).length;
      const bMatches = b.tags.filter(tag => currentBlog.tags.includes(tag)).length;
      return bMatches - aMatches;
    });

  return related.slice(0, limit);
};
