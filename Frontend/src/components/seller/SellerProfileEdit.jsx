import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSellerById,
  updateSeller,
  updateSellerImage,
  uploadSellerImage,
} from '../../services/AuthService';
import '../../styles/SellerProfileEdit.css';
import ViewAllSellerInfoButton from './ViewAllSellerInfoButton';

function SellerProfileEdit() {
  const navigate = useNavigate();
  const [sellerData, setSellerData] = useState({
    Name: '',
    Description: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const id = localStorage.getItem('userID');
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const data = await getSellerById(id);
        setSellerData(data);

        //if theres an image, set it to preview
        if (data.ImageUrl) {
          setPreviewImage(data.ImageUrl);
        }
      } catch (err) {
        setError('Failed to fetch seller data: ', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerData();
  }, [id]);

  const handleInputChange = (e) => {
    setSellerData({
      ...sellerData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newValidationErrors = {};

    if (!sellerData.Name) {
      newValidationErrors.Name = 'Name is required';
    } else if (sellerData.Name.length > 20) {
      newValidationErrors.Name = 'Name cannot exceed 20 characters';
    }

    if (sellerData.Description.length > 500) {
      newValidationErrors.Description =
        'Description cannot exceed 500 characters';
    }

    setValidationErrors(newValidationErrors);
    return Object.keys(newValidationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    if (validateForm()) {
      try {
        await updateSeller(id, sellerData);
        setSuccessMessage('Seller information updated successfully');
      } catch (error) {
        setError('Failed to update seller information: ', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    if (!selectedImage) {
      setError('Please select an image to upload.');
      setIsLoading(false);
      return;
    }

    try {
      let response;

      if (sellerData.ImageUrl) {
        // Call updateSellerImage if an existing image URL is present
        response = await updateSellerImage(
          selectedImage,
          id,
          sellerData.ImageUrl
        );
        setSuccessMessage('Image updated successfully');
      } else {
        // Call uploadSellerImage if no existing image URL is present
        response = await uploadSellerImage(selectedImage, id);
        setSuccessMessage('Image uploaded successfully');
      }

      // Update preview image with the new URL from the server
      setPreviewImage(response);
      console.log('Image uploaded/updated:', response);
    } catch (error) {
      setError('Failed to upload or update image');
      console.error('Failed to upload/update image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePreview = async (e) => {
    const file = e.target.files[0]; //get selected file
    setError(null); // Clear any previous errors

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only .jpg, .jpeg, or .png files are allowed.');
        setSelectedImage(null);
        setPreviewImage(null);
        return;
      }

      setSelectedImage(file); //update the selected file

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHomePageClick = () => {
    navigate('/s/dashboard');
  };

  return (
    <div className="seller-profile-edit-container">
      <div className="seller-profile-edit-form">
        <h2 className="seller-profile-edit-title">EDIT SELLER PROFILE</h2>

        <div className="seller-profile-edit-info-container">
          <p className="seller-profile-edit-info">
            Update your seller information and keep your profile up to date
          </p>
        </div>
        <ViewAllSellerInfoButton sellerId={id} />
        <div className="seller-profile-edit-info-image-and-detail-row">
          <div className="row-left">
            <div className="image-preview-container">
              {previewImage ? (
                <img src={previewImage} alt="Selected Preview" />
              ) : (
                <div className="image-preview-placeholder">No Image</div>
              )}
            </div>

            <div className="seller-profile-edit-group">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImagePreview}
                className="seller-image-input-button"
              />
              {error && !selectedImage && (
                <p className="seller-edit-error-message">{error}</p>
              )}
            </div>

            <button
              onClick={handleImageUpload}
              className="seller-profile-edit-submit"
            >
              UPLOAD IMAGE
            </button>
          </div>
          <hr className="seller-edit-vertical-line"></hr>
          <form onSubmit={handleSubmit} className="row-right">
            <div className="seller-profile-edit-inputs">
              <div className="seller-profile-edit-group">
                <input
                  type="text"
                  name="Name"
                  value={sellerData.Name}
                  onChange={handleInputChange}
                  placeholder=" "
                  className={`seller-profile-edit-input ${
                    validationErrors.Name ? 'error' : ''
                  }`}
                />
                <label className="seller-profile-edit-label">Name*</label>
                {validationErrors.Name && (
                  <p className="seller-edit-error-message">
                    {validationErrors.Name}
                  </p>
                )}
              </div>

              <div className="seller-profile-edit-group">
                <input
                  type="text"
                  name="Description"
                  value={sellerData.Description}
                  onChange={handleInputChange}
                  placeholder=" "
                  className={`seller-profile-edit-input ${
                    validationErrors.Description ? 'error' : ''
                  }`}
                />
                <label className="seller-profile-edit-label">Description</label>
                {validationErrors.Description && (
                  <p className="seller-edit-error-message">
                    {validationErrors.Description}
                  </p>
                )}
              </div>
            </div>

            <button type="submit" className="seller-profile-edit-submit">
              UPDATE INFORMATION
            </button>
          </form>
        </div>

        <p className="go-back-home">
          Go back to{' '}
          <a
            href="/c/sellerList"
            onClick={handleHomePageClick}
            className="go-back-home-link"
          >
            Home Page
          </a>
        </p>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>
    </div>
  );
}
export default SellerProfileEdit;
