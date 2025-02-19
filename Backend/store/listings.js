const listings = [
  {
    id: 201,
    title: "Red jacket",
    images: [{ fileName: "jacket1" }],
    price: 100,
    categoryId: 5,
    userId: 1,
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 3,
    title: "Gray couch in a great condition",
    images: [{ fileName: "couch2" }],
    categoryId: 1,
    price: 1200,
    userId: 2,
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 1,
    title: "Room & Board couch (great condition) - delivery included",
    description:
      "I'm selling my furniture at a discount price. Pick up at Venice. DM me asap.",
    images: [
      { fileName: "couch1" },
      { fileName: "couch2" },
      { fileName: "couch3" },
    ],
    price: 1000,
    categoryId: 1,
    userId: 1,
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 2,
    title: "Designer wear shoes",
    images: [{ fileName: "shoes1" }],
    categoryId: 5,
    price: 100,
    userId: 2,
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 102,
    title: "Canon 400D (Great Condition)",
    images: [{ fileName: "camera1" }],
    price: 300,
    categoryId: 3,
    userId: 1,
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 101,
    title: "Nikon D850 for sale",
    images: [{ fileName: "camera2" }],
    price: 350,
    categoryId: 3,
    userId: 1,
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 4,
    title: "Sectional couch - Delivery available",
    description: "No rips no stains no odors",
    images: [{ fileName: "couch3" }],
    categoryId: 1,
    price: 950,
    userId: 2,
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
  {
    id: 6,
    title: "Brown leather shoes",
    images: [{ fileName: "shoes2" }],
    categoryId: 5,
    price: 50,
    userId: 2,
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
  },
];

// Get the next available ID
const getNextId = () => {
  const maxId = listings.reduce((max, listing) => Math.max(max, listing.id), 0);
  return maxId + 1;
};

const addListing = (listing) => {
  listing.id = getNextId();
  listings.push(listing);
  return listing;
};

const getListings = () => listings;

const getListing = (id) => {
  const numId = parseInt(id);
  return listings.find((listing) => listing.id === numId);
};

const filterListings = (predicate) => listings.filter(predicate);

const updateListing = (id, updatedListing) => {
  const numId = parseInt(id);
  const index = listings.findIndex(listing => listing.id === numId);
  
  if (index === -1) {
    console.log(`Listing with id ${id} not found`);
    return null;
  }
  
  // Preserve the original id and userId
  const originalListing = listings[index];
  listings[index] = {
    ...originalListing,
    ...updatedListing,
    id: originalListing.id,
    userId: originalListing.userId,
  };
  
  console.log(`Updated listing ${id}:`, listings[index]);
  return listings[index];
};

const removeListing = (id) => {
  const numId = parseInt(id);
  const index = listings.findIndex(listing => listing.id === numId);
  
  if (index === -1) {
    console.log(`Listing with id ${id} not found`);
    return false;
  }
  
  listings.splice(index, 1);
  console.log(`Removed listing ${id}`);
  return true;
};

module.exports = {
  addListing,
  getListings,
  getListing,
  filterListings,
  updateListing,
  removeListing,
};
