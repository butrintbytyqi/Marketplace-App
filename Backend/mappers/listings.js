const config = require("config");

const mapper = listing => {
  const baseUrl = config.get("assetsBaseUrl");
  
  const mapImage = image => {
    const fileName = image.fileName;
    
    // Handle both old format (without extension) and new format (with extension)
    if (fileName.includes('.')) {
      // New format with extension
      return {
        url: `${baseUrl}${fileName}`,
        thumbnailUrl: `${baseUrl}${fileName}`
      };
    } else {
      // Old format without extension
      return {
        url: `${baseUrl}${fileName}_full.jpg`,
        thumbnailUrl: `${baseUrl}${fileName}_thumb.jpg`
      };
    }
  };

  return {
    ...listing,
    images: listing.images.map(mapImage)
  };
};

module.exports = mapper;
