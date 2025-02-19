const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const path = require("path");

const store = require("../store/listings");
const categoriesStore = require("../store/categories");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
const delay = require("../middleware/delay");
const listingMapper = require("../mappers/listings");
const config = require("config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '.jpg')
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 },
}).array("images", 10);

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().required().min(1),
  categoryId: Joi.number().required().min(1),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).optional(),
  userId: Joi.number().optional(), // Allow userId in the schema
  images: Joi.array().items(
    Joi.object({
      fileName: Joi.string().required()
    })
  ).optional() // Make images optional for updates
});

router.get("/", (req, res) => {
  const listings = store.getListings();
  const resources = listings.map(listingMapper);
  res.send(resources);
});

router.get("/me", auth, (req, res) => {
  console.log("User ID from token:", req.user.userId);
  const userListings = store.getListings().filter(
    listing => listing.userId === parseInt(req.user.userId)
  );
  console.log("Found listings:", userListings.length);
  const resources = userListings.map(listingMapper);
  res.send(resources);
});

router.post("/", auth, (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).send({ error: "Error uploading files" });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).send({ error: "At least one image is required" });
      }

      if (req.body.location) {
        try {
          req.body.location = JSON.parse(req.body.location);
        } catch (error) {
          return res.status(400).send({ error: "Invalid location format" });
        }
      }

      const listing = {
        title: req.body.title,
        price: parseFloat(req.body.price),
        categoryId: parseInt(req.body.categoryId),
        description: req.body.description,
        location: req.body.location,
        userId: parseInt(req.user.userId),
      };

      // Validate the listing data
      const { error } = schema.validate(listing);
      if (error) {
        return res.status(400).send({ error: error.details[0].message });
      }

      // Validate category
      if (!categoriesStore.getCategory(listing.categoryId)) {
        return res.status(400).send({ error: "Invalid categoryId." });
      }

      listing.images = req.files.map((file) => ({ 
        fileName: file.filename
      }));

      store.addListing(listing);

      res.status(201).send(listing);
    } catch (error) {
      console.error("Error creating listing:", error);
      res.status(500).send({ error: "Could not create the listing." });
    }
  });
});

router.put("/:id", auth, (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).send({ error: "Error uploading files" });
    }

    try {
      const listingId = parseInt(req.params.id);
      const existingListing = store.getListing(listingId);
      
      if (!existingListing) {
        console.log(`Listing ${listingId} not found`);
        return res.status(404).send({ error: "Listing not found" });
      }

      // Check if user owns the listing
      if (existingListing.userId !== parseInt(req.user.userId)) {
        console.log(`User ${req.user.userId} not authorized to update listing ${listingId}`);
        return res.status(403).send({ error: "Not authorized to update this listing" });
      }

      if (req.body.location) {
        try {
          req.body.location = JSON.parse(req.body.location);
        } catch (error) {
          return res.status(400).send({ error: "Invalid location format" });
        }
      }

      const updatedListing = {
        title: req.body.title,
        price: parseFloat(req.body.price),
        categoryId: parseInt(req.body.categoryId),
        description: req.body.description || existingListing.description,
        location: req.body.location || existingListing.location,
        images: existingListing.images // Keep existing images by default
      };

      // Add new images if provided
      if (req.files && req.files.length > 0) {
        updatedListing.images = req.files.map((file) => ({ 
          fileName: file.filename
        }));
      }

      // Validate the updated listing data
      const { error } = schema.validate({
        ...updatedListing,
        userId: existingListing.userId // Add userId for validation
      });
      
      if (error) {
        console.log("Validation error:", error.details[0].message);
        return res.status(400).send({ error: error.details[0].message });
      }

      // Validate category
      if (!categoriesStore.getCategory(updatedListing.categoryId)) {
        return res.status(400).send({ error: "Invalid categoryId." });
      }

      // Update the listing
      const result = store.updateListing(listingId, updatedListing);
      if (!result) {
        console.log(`Failed to update listing ${listingId}`);
        return res.status(500).send({ error: "Could not update the listing" });
      }

      console.log(`Successfully updated listing ${listingId}`);
      res.send(listingMapper(result));
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).send({ error: "Could not update the listing" });
    }
  });
});

router.delete("/:id", auth, (req, res) => {
  try {
    const listingId = parseInt(req.params.id);
    const listing = store.getListing(listingId);
    
    if (!listing) {
      console.log(`Listing ${listingId} not found`);
      return res.status(404).send({ error: "Listing not found" });
    }

    // Check if user owns the listing
    if (listing.userId !== parseInt(req.user.userId)) {
      console.log(`User ${req.user.userId} not authorized to delete listing ${listingId}`);
      return res.status(403).send({ error: "Not authorized to delete this listing" });
    }

    // Delete the listing
    const result = store.removeListing(listingId);
    if (!result) {
      console.log(`Failed to delete listing ${listingId}`);
      return res.status(500).send({ error: "Could not delete the listing" });
    }

    console.log(`Successfully deleted listing ${listingId}`);
    res.send({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).send({ error: "Could not delete the listing" });
  }
});

module.exports = router;
