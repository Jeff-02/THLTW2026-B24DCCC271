import React from 'react';
import { useLocation } from 'umi';
import HomePage from './HomePage';
import PostDetail from './PostDetail';
import About from './About';
import BlogManagement from './BlogManagement';
import TagManagement from './TagManagement';


const BlogCaNhanRouter: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname.includes('/admin/blog-management')) {
    return <BlogManagement />;
  }

  if (pathname.includes('/admin/tag-management')) {
    return <TagManagement />;   
  }

  if (pathname.includes('/blog/post/')) {
    return <PostDetail />;
  }

  if (pathname.includes('/blog/about')) {
    return <About />;
  }

  return <HomePage />;
};

export default BlogCaNhanRouter;
