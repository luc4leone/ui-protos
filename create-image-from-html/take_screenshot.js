const targetUrl = 'https://basecamp.com';

async function captureFullPageScreenshot() {
    try {
        const response = await fetch(targetUrl);
        const html = await response.text();
        
        // Crea un div temporaneo per contenere il contenuto
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);
        
        await loadLazyImages();
        
        const fullHeight = container.scrollHeight;
        const fullWidth = container.scrollWidth;
        
        const canvas = document.createElement('canvas');
        canvas.width = fullWidth;
        canvas.height = fullHeight;
        const ctx = canvas.getContext('2d');
        
        const svgData = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${fullWidth}" height="${fullHeight}">
                <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml">
                        ${container.innerHTML}
                    </div>
                </foreignObject>
            </svg>
        `;
        
        const img = new Image();
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const screenshot = await new Promise((resolve, reject) => {
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                URL.revokeObjectURL(url);
                resolve(canvas.toDataURL('image/png', 1.0));
            };
            img.onerror = reject;
            img.src = url;
        });
        
        document.body.removeChild(container);
        return screenshot;
    } catch (error) {
        throw new Error(`Errore nel caricamento della pagina: ${error.message}`);
    }
}

async function loadLazyImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    for (const img of lazyImages) {
        img.loading = 'eager';
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    }

    const promises = Array.from(document.images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    });

    await Promise.all(promises);
}

async function takeScreenshot() {
    try {
        const screenshot = await captureFullPageScreenshot();
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = screenshot;
        link.click();
    } catch (error) {
        console.error('Errore durante la cattura dello screenshot:', error);
    }
}

takeScreenshot();