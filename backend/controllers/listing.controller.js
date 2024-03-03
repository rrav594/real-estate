import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export async function createListing(req, res, next) {
  try {
    const listing = await Listing.create(req.body);

    res.json({ status: "success", listing });
  } catch (error) {
    next(error);
  }
}

export async function deleteListing(req, res, next) {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not Found."));
  }
  console.log(listing.userRef);
  console.log(req.user.id);
  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(401, "You can delete your own listing."));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ status: "success", message: "Listing has been deleted." });
  } catch (error) {
    next(error);
  }
}
