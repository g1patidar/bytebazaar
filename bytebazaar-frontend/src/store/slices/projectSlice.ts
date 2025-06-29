import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosPrivate } from '@/api/axios';
import { RootState } from '../index';

// Types
export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
  files?: string[];
  status: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviews: Array<{
    user: {
      _id: string;
      name: string;
      avatar?: string;
    };
    rating: number;
    comment: string;
  }>;
  images: string[];
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  sales?: number;
  downloads?: number;
  purchases?: string[];
}

export interface ProjectFilters {
  searchTerm: string;
  sortBy: 'latest' | 'price_low' | 'price_high' | 'popular';
}

export interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  selectedProject: Project | null;
  currentProject: Project | null;
  filters: ProjectFilters;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  selectedProject: null,
  currentProject: null,
  filters: {
    searchTerm: '',
    sortBy: 'latest'
  }
};

// Selectors
export const selectAllProjects = (state: RootState) => state.project.projects;
export const selectProjectLoading = (state: RootState) => state.project.loading;
export const selectProjectError = (state: RootState) => state.project.error;
export const selectSelectedProject = (state: RootState) => state.project.selectedProject;
export const selectCurrentProject = (state: RootState) => state.project.currentProject;
export const selectProjectFilters = (state: RootState) => state.project.filters;
export const selectProjects = (state: RootState) => state.project.projects;

export const selectProjectsByCategory = (category: string) => (state: RootState) => 
  state.project.projects.filter(project => project.category === category);

export const selectProjectById = (projectId: string) => (state: RootState) =>
  state.project.projects.find(project => project._id === projectId);

// Async Thunks
export const fetchProjects = createAsyncThunk<Project[], void>(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get('/projects');
      return response.data.projects;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectsByCategory = createAsyncThunk<Project[], string>(
  'projects/fetchProjectsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(`/projects/category/${category}`);
      return response.data.projects;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk<Project, string>(
  'projects/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.get(`/projects/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
    }
  }
);

export const addProject = createAsyncThunk<Project, FormData>(
  'projects/addProject',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.post('/projects', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add project');
    }
  }
);

export const uploadThumbnail = createAsyncThunk<Project, FormData>(
  'projects/uploadThumbnail',
  async (formData, thunkAPI) => {
    try {
      debugger
      const response = await axiosPrivate.post('/projects/upload-thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data as Project;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Upload failed');
    }
  }
);

export const updateProject = createAsyncThunk<Project, { id: string; formData: FormData }>(
  'projects/updateProject',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosPrivate.put(`/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk<string, string>(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await axiosPrivate.delete(`/projects/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

// Slice
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    setFilters: (state, action: PayloadAction<Partial<ProjectFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch Projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Projects by Category
      .addCase(fetchProjectsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjectsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Project
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Upload thumbnail 
      .addCase(uploadThumbnail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadThumbnail.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
      })
      .addCase(uploadThumbnail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject?._id === action.payload._id) {
          state.selectedProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(project => project._id !== action.payload);
        if (state.selectedProject?._id === action.payload) {
          state.selectedProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setSelectedProject, 
  clearSelectedProject,
  setCurrentProject, 
  clearCurrentProject,
  setFilters,
  setProjects,
  setLoading,
  setError
} = projectSlice.actions;

export default projectSlice.reducer; 