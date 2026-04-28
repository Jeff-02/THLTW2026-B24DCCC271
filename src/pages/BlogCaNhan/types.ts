// Status của bài viết
export type BlogStatus = 'Nháp' | 'Công khai' | 'Ẩn';

// Interface cho thẻ (tag)
export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

// Interface cho bài viết
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown content
  coverImage: string; // URL ảnh bìa
  tags: string[]; // Danh sách tag IDs
  status: BlogStatus;
  createDate: string;
  updateDate?: string;
  views: number;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  excerpt?: string; // Mô tả ngắn cho bài viết
}

// Form values cho thêm/sửa bài viết
export interface BlogFormValues {
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: BlogStatus;
  excerpt?: string;
}

// Thông tin tác giả
export interface AuthorInfo {
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    email?: string;
  };
}

// Pagination
export interface PaginationParams {
  page: number;
  pageSize: number;
}
