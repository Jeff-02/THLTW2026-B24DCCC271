# Blog Cá Nhân

Một ứng dụng blog cá nhân hiện đại được xây dựng bằng React + Ant Design + TypeScript.

## 📋 Chức năng chính

### 1. **Trang chủ (HomePage)**
- Hiển thị danh sách bài viết công khai dưới dạng Card
- Phân trang (9 bài/trang)
- Tìm kiếm bài viết với debounce 300ms
- Lọc bài viết theo thẻ
- Xem thông tin meta: Ngày đăng, Lượt xem

### 2. **Trang chi tiết bài viết (PostDetail)**
- Hiển thị toàn bộ nội dung bài viết (Markdown)
- Ảnh bìa
- Thông tin tác giả
- Meta information: Ngày tạo, lượt xem, ngày cập nhật
- Danh sách bài viết liên quan (dựa trên thẻ)
- Nút quay lại

### 3. **Trang giới thiệu (About)**
- Thông tin tác giả: Ảnh, Tên, Tiểu sử
- Danh sách kỹ năng
- Liên kết mạng xã hội (GitHub, LinkedIn, Twitter, Facebook, Email)
- Chỉnh sửa thông tin tác giả (form với validation)
- Các thành tựu và sở thích

### 4. **Quản lý bài viết (BlogManagement)**
- Bảng danh sách bài viết với các cột: Tiêu đề, Slug, Trạng thái, Thẻ, Lượt xem, Ngày tạo
- Tìm kiếm bài viết
- Thêm bài viết mới
- Chỉnh sửa bài viết
- Xóa bài viết (với Popconfirm xác nhận)
- Xem trước Markdown
- Auto-generate slug từ tiêu đề

### 5. **Quản lý thẻ (TagManagement)**
- Bảng danh sách thẻ
- Thêm thẻ mới
- Chỉnh sửa thẻ (tên, mô tả, màu sắc)
- Xóa thẻ (với xác nhận)
- Tìm kiếm thẻ

## 🗂️ Cấu trúc thư mục

```
BlogCaNhan/
├── index.tsx                    # Export chính
├── BlogCaNhanRouter.tsx          # Router component
├── HomePage.tsx                 # Trang chủ
├── PostDetail.tsx               # Chi tiết bài viết
├── About.tsx                    # Giới thiệu
├── BlogManagement.tsx           # Quản lý bài viết
├── TagManagement.tsx            # Quản lý thẻ
├── MarkdownRenderer.tsx         # Component render Markdown
├── types.ts                     # Định nghĩa kiểu dữ liệu
├── constants.ts                 # Hằng số ứng dụng
├── utils.ts                     # Hàm tiện ích
└── BlogCaNhan.less              # Styles
```

## 📦 Cấu trúc dữ liệu

### Blog
```typescript
interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;          // Markdown content
  coverImage: string;       // URL ảnh bìa
  tags: string[];           // Danh sách tag IDs
  status: BlogStatus;       // 'Nháp' | 'Công khai' | 'Ẩn'
  createDate: string;
  updateDate?: string;
  views: number;
  author: string;
  excerpt?: string;
}
```

### Tag
```typescript
interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;           // Hex color
}
```

### AuthorInfo
```typescript
interface AuthorInfo {
  name: string;
  avatar: string;           // URL ảnh
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
```

## 🚀 Cách cấu hình Routes

### Phương pháp 1: Sử dụng BlogCaNhanRouter (Hiện tại)
BlogCaNhanRouter sẽ tự động định tuyến dựa trên pathname:
- `/blog` → HomePage
- `/blog/post/:slug` → PostDetail
- `/blog/about` → About
- `/admin/blog-management` → BlogManagement
- `/admin/tag-management` → TagManagement

### Phương pháp 2: Cấu hình Routes riêng (Khuyên dùng)
Thêm vào file `config/routes.ts`:

```typescript
{
  path: '/blog',
  component: '@/pages/BlogCaNhan/HomePage',
},
{
  path: '/blog/post/:slug',
  component: '@/pages/BlogCaNhan/PostDetail',
},
{
  path: '/blog/about',
  component: '@/pages/BlogCaNhan/About',
},
{
  path: '/admin/blog-management',
  component: '@/pages/BlogCaNhan/BlogManagement',
},
{
  path: '/admin/tag-management',
  component: '@/pages/BlogCaNhan/TagManagement',
},
```

## 💾 Lưu trữ dữ liệu

Ứng dụng sử dụng `localStorage` để lưu trữ dữ liệu:
- `blogCaNhanBlogs` - Danh sách bài viết
- `blogCaNhanTags` - Danh sách thẻ
- `blogCaNhanAuthor` - Thông tin tác giả

## 🎨 Styles

Tất cả styles được định nghĩa trong file `BlogCaNhan.less`:
- Responsive design cho mobile, tablet, desktop
- Animations (fadeIn, slideUp)
- Consistent color scheme sử dụng Ant Design colors

## 📝 Sử dụng Markdown

Ứng dụng sử dụng library `marked` để render Markdown content. Hỗ trợ các tính năng:
- Headings (h1-h6)
- Lists (ul, ol)
- Code blocks
- Links
- Images
- Tables
- Blockquotes

## 🔧 Utilities

Các hàm tiện ích cung cấp:
- `loadBlogs()` / `saveBlogs()` - Quản lý bài viết
- `loadTags()` / `saveTags()` - Quản lý thẻ
- `getBlogBySlug()` - Tìm bài viết theo slug
- `getPublishedBlogs()` - Lấy bài viết công khai
- `searchBlogs()` - Tìm kiếm bài viết
- `generateSlug()` - Tạo slug từ tiêu đề
- `formatDate()` - Định dạng ngày tháng
- `getRelatedBlogs()` - Lấy bài viết liên quan
- `incrementViewCount()` - Tăng lượt xem

## 🎯 Features

- ✅ CRUD operations cho bài viết và thẻ
- ✅ Render Markdown cho nội dung bài viết
- ✅ Tìm kiếm và lọc bài viết
- ✅ Phân trang
- ✅ Tính năng xem trước Markdown
- ✅ Responsive design
- ✅ LocalStorage persistence
- ✅ Auto-generate slug
- ✅ Liên kết bài viết liên quan
- ✅ Quản lý thông tin tác giả
- ✅ Thẻ với màu sắc tùy chỉnh

## 📱 Responsive

Ứng dụng hoạt động tốt trên:
- 📱 Mobile (< 576px)
- 📱 Tablet (576px - 992px)
- 🖥️ Desktop (> 992px)

## 🎓 Hướng dẫn sử dụng

### Thêm bài viết mới:
1. Vào "Quản lý bài viết" (`/admin/blog-management`)
2. Click "Thêm bài viết"
3. Điền thông tin:
   - Tiêu đề
   - Slug (auto-generate từ tiêu đề)
   - Nội dung (Markdown)
   - Ảnh bìa (URL)
   - Thẻ (chọn từ danh sách)
   - Trạng thái (Nháp/Công khai/Ẩn)
4. Click "OK" để lưu

### Xem bài viết:
1. Vào trang chủ (`/blog`)
2. Tìm kiếm hoặc lọc theo thẻ
3. Click vào bài viết để xem chi tiết

### Quản lý thẻ:
1. Vào "Quản lý thẻ" (`/admin/tag-management`)
2. Thêm/Sửa/Xóa thẻ

### Chỉnh sửa thông tin tác giả:
1. Vào trang "Giới thiệu" (`/blog/about`)
2. Click "Chỉnh sửa thông tin"
3. Cập nhật thông tin và liên kết

## ⚠️ Ghi chú

- Tất cả dữ liệu được lưu trong `localStorage`, sẽ mất khi xóa cache
- Để sử dụng database, cần cấu hình backend API
- Slug phải độc nhất (ứng dụng sẽ kiểm tra)
- Chỉ bài viết có trạng thái "Công khai" mới hiển thị trên trang chủ

## 📚 Dependencies

- `antd` - UI Components
- `react` - UI Library
- `react-dom` - DOM Rendering
- `umi` - React Framework
- `marked` - Markdown Parser
- `axios` - HTTP Client

---

**Author:** Nguyễn Đức Trường
**Version:** 1.0.0
