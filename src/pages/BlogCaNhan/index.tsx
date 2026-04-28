// Default export - Router Component
export { default } from './BlogCaNhanRouter';

export { default as HomePage } from './HomePage';
export { default as PostDetail } from './PostDetail';
export { default as About } from './About';
export { default as BlogManagement } from './BlogManagement';
export { default as TagManagement } from './TagManagement';

export type { Blog, BlogFormValues, BlogStatus, Tag, AuthorInfo, PaginationParams } from './types';

export { AUTHOR_INFO, DEFAULT_TAGS, BLOG_STORAGE_KEY, TAGS_STORAGE_KEY, AUTHOR_STORAGE_KEY, ITEMS_PER_PAGE, DEBOUNCE_DELAY, BLOG_STATUS_OPTIONS, BLOG_STATUS_COLORS } from './constants';

export {
  loadBlogs,
  saveBlogs,
  getBlogBySlug,
  getPublishedBlogs,
  loadTags,
  saveTags,
  getTagById,
  getTagsByIds,
  loadAuthorInfo,
  saveAuthorInfo,
  generateSlug,
  isSlugUnique,
  searchBlogs,
  paginate,
  getTotalPages,
  formatDate,
  incrementViewCount,
  getRelatedBlogs,
} from './utils';