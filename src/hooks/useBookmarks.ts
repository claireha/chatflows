import { useState, useEffect } from 'react';
import { NavigationSubItem } from '../data/navigationData';

export interface BookmarkedItem extends NavigationSubItem {
  originalParent: string;
  originalSection: string;
}

const BOOKMARKS_STORAGE_KEY = 'hubspot-dashboard-bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (error) {
        console.error('Failed to parse saved bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (item: NavigationSubItem, originalParent: string, originalSection: string) => {
    const bookmarkedItem: BookmarkedItem = {
      ...item,
      originalParent,
      originalSection
    };

    setBookmarks(prev => {
      // Check if already bookmarked
      if (prev.some(b => b.id === item.id && b.originalParent === originalParent)) {
        return prev;
      }
      return [...prev, bookmarkedItem];
    });
  };

  const removeBookmark = (itemId: string, originalParent: string) => {
    setBookmarks(prev => 
      prev.filter(b => !(b.id === itemId && b.originalParent === originalParent))
    );
  };

  const isBookmarked = (itemId: string, originalParent: string) => {
    return bookmarks.some(b => b.id === itemId && b.originalParent === originalParent);
  };

  const toggleBookmark = (item: NavigationSubItem, originalParent: string, originalSection: string) => {
    if (isBookmarked(item.id, originalParent)) {
      removeBookmark(item.id, originalParent);
    } else {
      addBookmark(item, originalParent, originalSection);
    }
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark
  };
};