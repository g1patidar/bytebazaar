import { useEffect, useState } from 'react';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Link, Pencil, Trash2, Eye, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AddProjectForm } from '@/components/adminComponent/AddNewProject';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchProjects, 
  deleteProject, 
  addProject,
  Project,
  selectAllProjects,
  selectProjectLoading,
  selectProjectError,
  uploadThumbnail
} from '@/store/slices/projectSlice';
import { AppDispatch } from '@/store';
import { formatingProjectCategory, formatingProjectStatus } from '@/utils/project';

const ITEMS_PER_PAGE = 5  ;

const AdminProjects = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const projects = useAppSelector(selectAllProjects);
  const loading = useAppSelector(selectProjectLoading);
  const error = useAppSelector(selectProjectError);
  
  // Local state
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [projectId, setProjectId] = useState('');

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Filter projects based on search query and filters
  useEffect(() => {
    const filtered = projects?.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
    
    setFilteredProjects(filtered || []);
    setCurrentPage(1); // Reset to first page when filters change
  }, [projects, searchQuery, statusFilter, categoryFilter]);

  const handleEdit = (projectId: string) => {
    if (!projectId) return;
    navigate(`/admin/projects/edit/${projectId}`);
  };

  const handleDelete = async (projectId: string) => {
    if (!projectId || isDeleting) return;
    
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      setIsDeleting(true);
      const resultAction = await dispatch(deleteProject(projectId));
      
      if (deleteProject.fulfilled.match(resultAction)) {
        toast.success('Project deleted successfully');
        // Refresh the projects list
        dispatch(fetchProjects());
      } else if (deleteProject.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string || 'Failed to delete project');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project');
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = (projectId: string) => {
    if (!projectId) return;
    navigate(`/projects/${projectId}`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => dispatch(fetchProjects())}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Manage Projects</h1>
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isDeleting}
        >
          Add New Project
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="inProgress">In Progress</option>
              <option value="planning">Planning</option>
            </select>
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="webDev">Web Development</option>
              <option value="mobileApp">Mobile App</option>
              <option value="ui/ux">UI/UX</option>
              <option value="dataAnalysis">Data Analysis</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full">
        <main>
          <div className="bg-white rounded-lg shadow p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-400">Loading project data...</div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentProjects.map((project) => (
                        <tr key={project._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">{project.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatingProjectCategory(project.category)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{project.createdBy?.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  project.status === 'inProgress' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'}`}>
                              {formatingProjectStatus(project.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">${project.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleView(project._id)}
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                disabled={isDeleting}
                                title="View Project"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleEdit(project._id)}
                                className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                                disabled={isDeleting}
                                title="Edit Project"
                              >
                                <Pencil className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(project._id)}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                disabled={isDeleting}
                                title="Delete Project"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(endIndex, filteredProjects.length)}</span> of{' '}
                        <span className="font-medium">{filteredProjects.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              currentPage === index + 1
                                ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
    {isOpen && <AddProjectForm setProjectId={setProjectId} projectId={projectId} setIsOpen={setIsOpen} isEdit={false} projectData={{}}/>}
    </>
  );
};

export default AdminProjects;
