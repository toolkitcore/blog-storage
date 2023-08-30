const fs = require('fs').promises;
const https = require('https');
const path = require('path');
const downloadFolder = 'all'; // Change this to your desired folder name
const jsonFilePath = "C:\\Users\\Truong Nhon\\Desktop\\crawling\\url.json"


function downloadImage(url, folderPath, filename) {
    https.get(url, response => {
        const imageData = [];
        response.on('data', chunk => {
            imageData.push(chunk);
        });

        response.on('end', () => {
            const imageBuffer = Buffer.concat(imageData);
            const imagePath = path.join(folderPath, filename);

            fs.writeFile(imagePath, imageBuffer)
                .then(() => {
                    console.log(`Downloaded: ${filename}`);
                })
                .catch(error => {
                    console.error(`Error writing ${filename}:`, error);
                });
        });
    }).on('error', error => {
        console.error(`Error downloading ${filename}:`, error);
    });
}

async function downloadImagesFromJSON(filePath, downloadFolder) {
    try {
        const jsonData = await fs.readFile(filePath, 'utf-8');
        const imageUrls = JSON.parse(jsonData);

        for (let i = 0; i < imageUrls.length; i++) {
            const imageUrl = imageUrls[i];
            const imageName = `image${i + 1}.jpg`; // Generate a filename for the image
            const imageFolderPath = path.join(__dirname, downloadFolder);

            try {
                await fs.access(imageFolderPath);
            } catch (error) {
                await fs.mkdir(imageFolderPath);
            }

            downloadImage(imageUrl, imageFolderPath, imageName);
        }
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }
}

downloadImagesFromJSON(jsonFilePath, downloadFolder);
