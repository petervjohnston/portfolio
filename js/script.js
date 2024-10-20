// Constants
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxsIz-BbRcOc7FgVrw_qe_lLSXhhtezYCPJwH6spounhcrJIJT1it_UmnWt6evNYmp_/exec';

/**
 * Fetches image data from the Google Sheet.
 * @returns {Promise<Array>} A promise that resolves to an array of image data.
 */
async function fetchImageData() {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.slice(1); // Assuming the first row is headers
  } catch (error) {
    console.error('Error fetching image data:', error);
    throw error;
  }
}

/**
 * Creates an image element with the given data.
 * @param {Object} imageData - The data for a single image.
 * @returns {HTMLElement} The created figure element containing the image.
 */
function createImageElement(imageData) {
  const [title, category, medium, completionDate, imageUrl] = imageData;

  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = title;
  img.title = `${title} - ${medium} (${completionDate})`;

  const caption = document.createElement('figcaption');
  caption.textContent = title;

  figure.appendChild(img);
  figure.appendChild(caption);

  return figure;
}

/**
 * Displays images in their respective category galleries.
 * @param {Array} images - The array of image data.
 */
function displayImages(images) {
  const galleries = document.querySelectorAll('.image-gallery');
  
  galleries.forEach(gallery => {
    const category = gallery.dataset.category;
    const categoryImages = images.filter(img => img[1] === category);
    
    gallery.innerHTML = ''; // Clear existing content
    categoryImages.forEach(imageData => {
      const imageElement = createImageElement(imageData);
      gallery.appendChild(imageElement);
    });
  });
}

/**
 * Initializes the image gallery.
 */
async function initializeGallery() {
  try {
    const imageData = await fetchImageData();
    displayImages(imageData);
  } catch (error) {
    console.error('Failed to initialize gallery:', error);
    // You might want to display an error message to the user here
  }
}

// Initialize the gallery when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeGallery);