async function loadImages() {
    const SHEET_ID = 'your-google-sheet-id';
    const SHEET_NAME = 'Sheet1';
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

    try {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        const images = parseCSV(csvText);
        
        const galleries = document.querySelectorAll('.image-gallery');
        galleries.forEach(gallery => {
            const category = gallery.dataset.category;
            const categoryImages = images.filter(img => img.category === category);
            displayImages(categoryImages, gallery);
        });
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
        }, {});
    });
}

function displayImages(images, container) {
    container.innerHTML = '';
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.imageUrl;
        imgElement.alt = image.title;
        imgElement.title = `${image.title} - ${image.medium} (${image.completionDate})`;
        
        const figureElement = document.createElement('figure');
        figureElement.appendChild(imgElement);
        
        const captionElement = document.createElement('figcaption');
        captionElement.textContent = image.title;
        figureElement.appendChild(captionElement);
        
        container.appendChild(figureElement);
    });
}

document.addEventListener('DOMContentLoaded', loadImages);