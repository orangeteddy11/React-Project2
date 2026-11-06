// UploadFile.js: upload repair photos to Supabase Storage (bucket "Images").
// Shows a preview before uploading and a gallery of all uploaded images.
import { useState, useEffect, useCallback } from 'react';
import { supabase } from './include/supabaseClient';

const BUCKET = 'Images';
const MAX_SIZE = 5 * 1024 * 1024;

// Storage file names cannot contain spaces or special characters
const safeName = (name) => name.replace(/[^A-Za-z0-9._-]/g, '_');

function UploadFile() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [images, setImages] = useState([]);

  // Load every image stored in the bucket, newest first, with its public URL
  const loadImages = useCallback(async () => {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    if (error) {
      setMessage('Could not load images: ' + error.message);
      return;
    }
    setImages(
      data
        .filter(item => item.id && !item.name.startsWith('.'))
        .map(item => ({
          name: item.name,
          url: supabase.storage.from(BUCKET).getPublicUrl(item.name).data.publicUrl
        }))
    );
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Preview: show the chosen file in the browser before it is uploaded
  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Check the chosen file is an image and not too big
  const onSelect = (event) => {
    const picked = event.target.files[0];
    setMessage('');
    setUploadedUrl('');
    if (!picked) {
      setFile(null);
      return;
    }
    if (!picked.type.startsWith('image/')) {
      setMessage('Please choose an image file.');
      event.target.value = '';
      setFile(null);
      return;
    }
    if (picked.size > MAX_SIZE) {
      setMessage('The image must be under 5 MB.');
      event.target.value = '';
      setFile(null);
      return;
    }
    setFile(picked);
  };

  // Upload the file; upsert = true overwrites a file with the same name
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }
    const form = event.target;
    const path = safeName(file.name);

    setUploading(true);
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: true });
    setUploading(false);

    if (error) {
      console.error('Error uploading file:', error);
      setMessage('File upload failed: ' + error.message);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setMessage('File uploaded successfully!');
    setUploadedUrl(data.publicUrl);
    setFile(null);
    form.reset();
    loadImages();
  };

  return (<>
    <div className="bg-white text-dark rounded p-3 mb-3">
      <h6 className="fw-bold">Upload a photo of the phone</h6>
      <form onSubmit={onSubmit}>
        <input className="form-control mb-2" type="file" name="fileInput" accept="image/*" onChange={onSelect} />
        {preview && (
          <div className="mb-2">
            <div className="small text-muted">Preview (not uploaded yet):</div>
            <img src={preview} alt="Preview" style={{ maxHeight: '180px', maxWidth: '100%' }} className="border rounded" />
          </div>
        )}
        <button type="submit" className="btn btn-dark" disabled={uploading || !file}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p className="mt-2 mb-0">{message}</p>}
      {uploadedUrl && (
        <p className="small mb-0">
          Link: <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">{uploadedUrl}</a>
        </p>
      )}
    </div>

    {/* Gallery of all images stored in the bucket */}
    <div className="bg-white text-dark rounded p-3">
      <h6 className="fw-bold">Uploaded photos ({images.length})</h6>
      {images.length === 0 ? (
        <p className="text-muted m-0">No images uploaded yet.</p>
      ) : (
        <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
          {images.map(img => (
            <a key={img.name} href={img.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark">
              <img src={img.url} alt={img.name} className="border rounded w-100" style={{ height: '120px', objectFit: 'cover' }} />
              <div className="small text-truncate">{img.name}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  </>);
}

export default UploadFile;