import Listing from "../models/listing.model.js";

export async function createListing(req, res, next) {
  try {
    const listing = await Listing.create(req.body);

    res.json({ status: "success", listing });
  } catch (error) {
    next(error);
  }
}
