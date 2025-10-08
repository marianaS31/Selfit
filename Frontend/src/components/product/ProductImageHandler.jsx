import React, { useRef, useState } from 'react';
import '../../styles/productImageHandler.css';
import {
  deleteProductImage,
  updateProductImage,
  uploadProductImage,
} from '../../services/AuthService';
import { Upload, Trash2, RefreshCw } from 'lucide-react';

function ProductImageHandler({ product, onImageUpdate }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only .jpg, .jpeg, or .png files are allowed.');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmitImage = async () => {
    if (!selectedFile) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let uploadedImageUrl;
      if (product.ImageUrl) {
        uploadedImageUrl = await updateProductImage(
          product.ProductId,
          selectedFile
        );
      } else {
        uploadedImageUrl = await uploadProductImage(
          product.ProductId,
          selectedFile
        );
      }

      //image image url after uploading
      product.ImageUrl = uploadedImageUrl;

      //refresh componment
      onImageUpdate();

      setSelectedFile(null);
    } catch (err) {
      setError('Failed to process the image');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteProductImage(product.ProductId);
      // clear image preview
      setImagePreview(null);
      product.ImageUrl = null;
      onImageUpdate();
    } catch (err) {
      setError('Failed to delete image');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="image-handler-container">
      <div className="store-image-buttons-container">
        <button
          className={`store-image-action-button ${
            product.ImageUrl ? 'store-update-button' : 'store-upload-button'
          }`}
          onClick={handleUploadClick}
          disabled={isLoading}
        >
          {product.ImageUrl ? (
            <>
              <RefreshCw className="button-icon" />
              <span>Update Image</span>
            </>
          ) : (
            <>
              <Upload className="button-icon" />
              <span>Add Image</span>
            </>
          )}
        </button>

        {product.ImageUrl && (
          <button
            className="store-image-action-button delete-button"
            onClick={handleDeleteImage}
            disabled={isLoading}
          >
            <Trash2 className="button-icon" />
            <span>Delete Image</span>
          </button>
        )}
      </div>

      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="store-file-input"
      />

      {imagePreview && (
        <>
          <div className="store-image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
          </div>
          <button
            className="store-submit-image-button"
            onClick={handleSubmitImage}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? 'Processing...' : 'Submit Image'}
          </button>
        </>
      )}

      {!imagePreview && product.ImageUrl && (
        <div className="store-current-image-container">
          <img
            src={product.ImageUrl}
            alt={product.Name}
            className="store-current-image"
          />
        </div>
      )}

      {!imagePreview && !product.ImageUrl && (
        <div className="store-mage-preview-container">
          <div className="image-preview-placeholder">
            Select an image to preview
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ProductImageHandler;
