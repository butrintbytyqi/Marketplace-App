import client from "./client";

const endpoint = "/listings";

const getListings = () => client.get(endpoint);

export const addListing = (listing) => {
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price.toString()); // Ensure price is a string
  data.append("categoryId", listing.category.value.toString()); // Ensure categoryId is a string
  data.append("description", listing.description);
  if (listing.location)
    data.append("location", JSON.stringify(listing.location));

  listing.images.forEach((image, index) => {
    const imageData = {
      uri: image,
      type: "image/jpeg",
      name: `image${index}.jpg`,
    };
    data.append("images", imageData);
  });

  return client.post(endpoint, data);
};

export default {
  addListing,
  getListings,
};
