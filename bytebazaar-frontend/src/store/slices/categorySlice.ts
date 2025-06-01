import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '@/types';
import { RootState } from '../index';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const loadCategoryState = (): CategoryState => {
  try {
    const serializedState = localStorage.getItem('categoryState');
    if (serializedState === null) {
      return {
        categories: [],
        loading: false,
        error: null
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      categories: [],
      loading: false,
      error: null
    };
  }
};

const saveCategoryState = (state: CategoryState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('categoryState', serializedState);
  } catch (err) {
    console.error('Failed to save category state to localStorage:', err);
  }
};

const initialState: CategoryState = loadCategoryState();

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      saveCategoryState(state);
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
      saveCategoryState(state);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(cat => cat._id === action.payload._id);
      if (index !== -1) {
        state.categories[index] = action.payload;
        saveCategoryState(state);
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat._id !== action.payload);
      saveCategoryState(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setLoading,
  setError
} = categorySlice.actions;

export const selectCategories = (state: RootState) => state.category.categories;
export const selectCategoryLoading = (state: RootState) => state.category.loading;
export const selectCategoryError = (state: RootState) => state.category.error;

export default categorySlice.reducer; 