import client, { listingsClient } from "./client";
import authStorage from "../auth/storage";

const endpoint = "/listings";

const getListings = async () => {
  try {
    const response = await client.get(endpoint);
    if (!response.ok) {
      console.log("Listings API Error:", response.problem, response.data);
    }
    return response;
  } catch (error) {
    console.log("Listings API Exception:", error);
    return { ok: false, problem: 'CLIENT_ERROR', data: null, originalError: error };
  }
};

const getMyListings = async () => {
  try {
    const response = await client.get(`${endpoint}/me`);
    if (!response.ok) {
      console.log("My Listings API Error:", response.problem, response.data);
    }
    return response;
  } catch (error) {
    console.log("My Listings API Exception:", error);
    return { ok: false, problem: 'CLIENT_ERROR', data: null, originalError: error };
  }
};

const addListing = async (listing, onUploadProgress) => {
  try {
    const data = new FormData();
    
    // Add required fields
    data.append("title", listing.title.trim());
    data.append("price", listing.price.toString());
    data.append("categoryId", listing.category.value.toString());
    
    // Add optional fields if they exist and are not empty
    if (listing.description?.trim()) {
      data.append("description", listing.description.trim());
    }
    
    if (listing.location) {
      // Only include necessary location data
      const { latitude, longitude } = listing.location;
      data.append("location", JSON.stringify({ latitude, longitude }));
    }

    // Add images
    if (listing.images && listing.images.length > 0) {
      listing.images.forEach((image, index) => {
        const imageUri = image.startsWith('file://') ? image : `file://${image}`;
        data.append("images", {
          uri: imageUri,
          type: "image/jpeg",
          name: `image${index}.jpg`,
        });
      });
    }

    // Get auth token manually
    const authToken = await authStorage.getToken();
    if (!authToken) {
      console.log("No auth token found for listing creation");
      return {
        ok: false,
        problem: 'CLIENT_ERROR',
        data: { error: "Authentication required" }
      };
    }

    // Log the data being sent (excluding image content)
    const dataEntries = Array.from(data.entries()).map(([key, value]) => {
      if (key === 'images') {
        return [key, 'image data...'];
      }
      return [key, value];
    });
    console.log("Sending listing data:", Object.fromEntries(dataEntries));

    // Use the listings client with manual auth header
    const response = await listingsClient.post(endpoint, data, {
      headers: {
        "x-auth-token": authToken
      },
      onUploadProgress: (progress) => 
        onUploadProgress(progress.loaded / progress.total),
    });

    if (!response.ok) {
      console.log("Failed to add listing:", response.problem, response.data);
    } else {
      console.log("Listing added successfully:", response.data);
    }

    return response;
  } catch (error) {
    console.log("Error adding listing:", error);
    return {
      ok: false,
      problem: 'CLIENT_ERROR',
      data: { error: error.message },
      originalError: error
    };
  }
};

const updateListing = async (listingId, listing) => {
  try {
    const data = new FormData();
    
    // Add required fields
    data.append("title", listing.title.trim());
    data.append("price", listing.price.toString());
    data.append("categoryId", listing.category.value.toString());
    
    // Add optional fields if they exist and are not empty
    if (listing.description?.trim()) {
      data.append("description", listing.description.trim());
    }
    
    if (listing.location) {
      data.append("location", JSON.stringify(listing.location));
    }

    // Add images
    if (listing.images && listing.images.length > 0) {
      listing.images.forEach((image, index) => {
        // Handle both new images (file:// or content://) and existing images (URLs or fileName objects)
        if (typeof image === 'string') {
          if (image.startsWith('file://') || image.startsWith('content://')) {
            // New image
            const imageUri = image.startsWith('file://') ? image : `file://${image}`;
            data.append("images", {
              uri: imageUri,
              type: "image/jpeg",
              name: `image${index}.jpg`,
            });
          } else {
            // Existing image URL - keep as is
            data.append("images", JSON.stringify({ fileName: image.split('/').pop() }));
          }
        } else if (image.fileName) {
          // Existing image object - keep as is
          data.append("images", JSON.stringify({ fileName: image.fileName }));
        }
      });
    }

    // Get auth token manually
    const authToken = await authStorage.getToken();
    if (!authToken) {
      console.log("No auth token found for listing update");
      return {
        ok: false,
        problem: 'CLIENT_ERROR',
        data: { error: "Authentication required" }
      };
    }

    // Log the data being sent (excluding image content)
    const dataEntries = Array.from(data.entries()).map(([key, value]) => {
      if (key === 'images' && typeof value === 'object' && value.uri) {
        return [key, 'new image data...'];
      }
      return [key, value];
    });
    console.log("Sending update data:", Object.fromEntries(dataEntries));

    // Use the listings client with manual auth header
    const response = await listingsClient.put(`/listings/${listingId}`, data, {
      headers: {
        "x-auth-token": authToken
      }
    });

    if (!response.ok) {
      console.log("Failed to update listing:", response.problem, response.data);
    } else {
      console.log("Listing updated successfully:", response.data);
    }

    return response;
  } catch (error) {
    console.log("Error updating listing:", error);
    return {
      ok: false,
      problem: 'CLIENT_ERROR',
      data: { error: error.message },
      originalError: error
    };
  }
};

const deleteListing = async (listingId) => {
  try {
    const response = await client.delete(`${endpoint}/${listingId}`);
    
    if (!response.ok) {
      console.log("Failed to delete listing:", response.problem, response.data);
    } else {
      console.log("Listing deleted successfully");
    }

    return response;
  } catch (error) {
    console.log("Error deleting listing:", error);
    return {
      ok: false,
      problem: 'CLIENT_ERROR',
      data: { error: error.message },
      originalError: error
    };
  }
};

export default {
  addListing,
  getListings,
  getMyListings,
  updateListing,
  deleteListing,
};
