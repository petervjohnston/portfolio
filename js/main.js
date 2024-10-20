async function loadImages() {
    const SHEET_ID = '1VtP8hzcGotpN2KQb3M_42NbPh3e_2J5q'; // Replace with your actual Sheet ID
    const SHEET_NAME = 'Sheet1'; // Make sure this matches your sheet name
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

    try {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        const images = parseCSV(csvText);
        
        const galleries = document.querySelectorAll('.image-gallery');
        galleries.forEach(gallery => {
            const category = gallery.dataset.category;
            const categoryImages = images.filter(img => img.Category === category);
            displayImages(categoryImages, gallery);
        });
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}

function displayImages(images, container) {
    container.innerHTML = '';
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image['Resized Image URL']; // Make sure this matches your column name
        imgElement.alt = image.Title;
        imgElement.title = `${image.Title} - ${image.Medium} (${image['Completion Date']})`;
        
        const figureElement = document.createElement('figure');
        figureElement.appendChild(imgElement);
        
        const captionElement = document.createElement('figcaption');
        captionElement.textContent = image.Title;
        figureElement.appendChild(captionElement);
        
        container.appendChild(figureElement);
    });
}

document.addEventListener('DOMContentLoaded', loadImages);