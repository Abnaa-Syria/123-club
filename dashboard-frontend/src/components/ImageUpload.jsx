import { useState, useRef, useEffect } from 'react';
import { uploadAPI } from '../api/services';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUtils';

export default function ImageUpload({ value, onChange, type = 'avatars', label = 'Image', className = '' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize preview from value
  useEffect(() => {
    if (value) {
      const url = getImageUrl(value);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadAPI.upload(type, formData);
      const imagePath = res.data?.data?.path;
      if (imagePath) {
        // Update form data - this will trigger useEffect to update preview
        onChange(imagePath);
        // Also update preview immediately for better UX
        const uploadedUrl = getImageUrl(imagePath);
        setPreview(uploadedUrl);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error('No path returned from upload');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
      // Reset preview to previous value on error
      const previousUrl = value ? getImageUrl(value) : null;
      setPreview(previousUrl);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {preview && (
          <div className="relative inline-block">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              onError={(e) => {
                console.error('Image load error:', preview);
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e5e7eb" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="12">No Image</text></svg>';
              }}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id={`image-upload-${type}`}
          />
          <label
            htmlFor={`image-upload-${type}`}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Upload Image'}
          </label>
        </div>
        {value && !preview && (
          <p className="text-sm text-gray-500">Current: {value}</p>
        )}
      </div>
    </div>
  );
}

