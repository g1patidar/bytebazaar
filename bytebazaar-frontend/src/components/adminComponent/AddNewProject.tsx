import { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Image, Files } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addProject, fetchProjects, uploadThumbnail } from '@/store/slices/projectSlice';
import { toast } from 'sonner';
import { AppDispatch } from '@/store';
import { useNavigate } from 'react-router-dom';

// Add this interface above your component
interface ProjectData {
  title?: string;
  price?: string;
  category?: string;
  status?: string;
  description?: string;
  // add other fields as needed
}

interface AddProjectFormProps {
  projectData: ProjectData,
  setProjectId: (setProjectId: string) => void;
  projectId: string;
  setIsOpen: (isOpen: boolean) => void;
  isEdit: boolean;
}

export const AddProjectForm = ({projectData, projectId, setProjectId, setIsOpen, isEdit }: AddProjectFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33);
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('planning');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  // Update progress when step changes
  useEffect(() => {
    setProgress(step * 33);
  }, [step]);

  useEffect(()=>{
    if (
      projectData?.title &&
      projectData.price &&
      projectData.category &&
      projectData.status &&
      projectData.description
    ) {
      setTitle(projectData.title || '');
      setPrice(projectData.price || '');
      setCategory(projectData.category || '');
      setStatus(projectData.status || '');
      setDescription(projectData.description || '');
      setStep(2);
    }
  },[projectData])

  const validateStep1 = () => {
    if (!title || !description || !category || !price) {
      alert('Please fill in all required fields');
      return false;
    }
    return true;
  };
  

  const handleAddProject = async (formData: any) => {
    try {
      const resultAction = await dispatch(addProject(formData));
      if (addProject.fulfilled.match(resultAction)) {
        setProjectId(resultAction.payload._id)
        // setIsOpen(false);
        toast.success('Project added successfully');
        // Refresh the projects list
        dispatch(fetchProjects());
      } else if (addProject.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string || 'Failed to add project');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add project');
      console.error('Add project error:', error);
    }
  };

  const handleUploadThumbnail = async (formData: FormData) => {
    try {
      const resultAction = await dispatch(uploadThumbnail(formData));
      if (uploadThumbnail.fulfilled.match(resultAction)) {
        toast.success('Thumbnail uploaded successfully');
      } else if (uploadThumbnail.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string || 'Failed to upload thumbnail');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload thumbnail');
      console.error('Upload thumbnail error:', error);
    }
    finally{
      navigate(`/admin/projects`);
      setLoading(false);
    }
  };


  const handleThumbnailSubmit = async () => {
    if (!thumbnail || !projectId) return;
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('thumbnail', thumbnail);
      
      await handleUploadThumbnail(formData);
      
      // Navigate to next step after successful upload
      setStep(3);
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if(projectId){
      setStep((prev)=>prev+1);
    }
    if(isEdit && step === 1){
      setStep(2);
      return;
    }
    if (step === 1) {
      if (!validateStep1()) return;
      
      try {
        setLoading(true);
        
        // Create the initial project with basic info
        const formData = {
          title,
          description,
          category,
          price,
          status
        };
        
        await handleAddProject(formData);
        // In a real application, you would get the project ID from the server response
        // For now, we'll simulate it with a random ID
        
        setStep(2);
      } catch (error) {
        console.error('Error creating project:', error);
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {

      try {
        setLoading(true);
        // Create the initial project with basic info
        const formData = new FormData();
        formData.append('projectId', projectId);
        formData.append('thumbnail', thumbnail);
        
        await handleUploadThumbnail(formData);
        
        // Move to the last step
        setStep(3);
      } catch (error) {
        console.error('Error creating project:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };


  const handleFilesSubmit = async () => {
    if (files.length === 0 || !projectId) return;
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('projectId', projectId);
      
      files.forEach((file) => {
        formData.append('files', file);
      });
      
      // await onSubmit(formData);
      
      // Complete the form
      handleComplete();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    // Reset form and close dialog
    setTitle('');
    setDescription('');
    setCategory('');
    setPrice('');
    setStatus('planning');
    setThumbnail(null);
    setFiles([]);
    setProjectId(null);
    setStep(1);
    setIsOpen(false);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="webDev">Web Development</option>
                  <option value="mobileApp">Mobile App</option>
                  <option value="ui/ux">UI/UX</option>
                  <option value="dataAnalysis">Data Analysis</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planning">Planning</option>
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </>
        );
      
      case 2:
        return (
          <div className="py-6">
            <div className="flex justify-center items-center mb-6">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <Image size={48} className="mx-auto mb-3 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Upload Project Thumbnail</h3>
                <p className="text-sm text-gray-500 mb-4">
                  This will be the main image displayed for your project
                </p>
                
                <div className="flex items-center justify-center">
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    onChange={handleThumbnailChange}
                    accept="image/*"
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
                  >
                    Choose Image
                  </label>
                </div>
              </div>
            </div>
            
            {thumbnail && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden mr-3">
                      <img 
                        src={URL.createObjectURL(thumbnail)} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">{thumbnail.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="py-6">
            <div className="flex justify-center items-center mb-6">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <Files size={48} className="mx-auto mb-3 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Upload Project Files</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add any documents, images, or resources related to your project
                </p>
                
                <div className="flex items-center justify-center">
                  <input
                    type="file"
                    ref={filesInputRef}
                    onChange={handleFilesChange}
                    multiple
                    className="hidden"
                    id="files-upload"
                  />
                  <label
                    htmlFor="files-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
                  >
                    Choose Files
                  </label>
                </div>
              </div>
            </div>
            
            {files.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-white p-2 rounded">
                      <span className="text-sm truncate max-w-xs">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderStepButtons = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 mr-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? 'Creating...' :projectId ? 'Next' : 'Create Project'}
              {!loading && <ChevronRight size={16} className="ml-1" />}
            </button>
          </div>
        );
      
      case 2:
        return (
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
              disabled={loading}
            >
              <ChevronLeft size={16} className="mr-1" />
              Back
            </button>
            <div>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 mr-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleThumbnailSubmit}
                disabled={!thumbnail || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {loading ? 'Uploading...' : 'Upload & Continue'}
                {!loading && <ChevronRight size={16} className="ml-1" />}
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
              disabled={loading}
            >
              <ChevronLeft size={16} className="mr-1" />
              Back
            </button>
            <div>
              <button
                type="button"
                onClick={handleComplete}
                className="px-4 py-2 mr-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Skip & Finish
              </button>
              <button
                type="button"
                onClick={handleFilesSubmit}
                disabled={files.length === 0 || loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {loading ? 'Uploading...' : 'Upload & Complete'}
                <Check size={16} className="ml-1" />
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {step === 1 ? "Add New Project" : 
             step === 2 ? "Upload Thumbnail" : 
             "Upload Project Files"}
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <div className="text-xs font-medium">Step {step} of 3</div>
            <div className="text-xs font-medium">{progress}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mb-6">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className="text-xs mt-1">Basic Info</span>
          </div>
          <div className="flex-1 self-center px-2">
            <div className="h-0.5 bg-gray-200">
              <div 
                className="h-0.5 bg-blue-600" 
                style={{ width: step > 1 ? '100%' : '0%' }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="text-xs mt-1">Thumbnail</span>
          </div>
          <div className="flex-1 self-center px-2">
            <div className="h-0.5 bg-gray-200">
              <div 
                className="h-0.5 bg-blue-600" 
                style={{ width: step > 2 ? '100%' : '0%' }}
              ></div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="text-xs mt-1">Files</span>
          </div>
        </div>
        
        {/* Form content based on current step */}
        <div>
          {renderStepContent()}
        </div>
        
        {/* Navigation buttons */}
        <div className="mt-6">
          {renderStepButtons()}
        </div>
      </div>
    </div>
  );
};