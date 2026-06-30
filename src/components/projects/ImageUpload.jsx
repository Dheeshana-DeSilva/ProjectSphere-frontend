import { ImagePlus, X } from 'lucide-react';

function ImageUpload({ error, imageUrl, onChange }) {
  const preview = imageUrl || '';

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    onChange(file, nextPreview);
  };

  const clearImage = () => {
    onChange(null, '');
  };

  return (
    <div className="form-field">
      <label htmlFor="thumbnail">Project thumbnail</label>
      <div className={`image-upload ${error ? 'image-upload-error' : ''}`}>
        {preview ? (
          <div className="image-upload-preview">
            <img src={preview} alt="Project thumbnail preview" />
            <button
              type="button"
              className="image-upload-remove"
              onClick={clearImage}
              aria-label="Remove thumbnail"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <label className="image-upload-dropzone" htmlFor="thumbnail">
            <ImagePlus size={34} />
            <span>Upload a thumbnail image</span>
            <small>PNG, JPG, or WEBP up to 5 MB</small>
          </label>
        )}
        <input
          id="thumbnail"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
        />
      </div>
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}

export default ImageUpload;
