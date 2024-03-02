import { app } from "../firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  //   console.log(currentUser);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    parking: false,
    offer: false,
    furnished: false,
  });
  console.log(formData);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleImageSubmit(e) {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed ( 2mb max per image.)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload 6 images per listing.");
      setUploading(false);
    }
  }

  async function storeImage(file) {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload id ${progress}% done..`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }

  function handleRemoveImage(index) {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => {
        i !== index;
      }),
    });
  }

  function handleChange(e) {
    e.preventDefault();
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id == "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must upload atleast one image.");
      }
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price can not be higher then regular price.");
      setLoading(true);
      setError(false);
      const res = await fetch("http://localhost:8000/api/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      console.log(data);

      if (data.status === "fail") {
        setError(data.message);
      }
      setLoading(false);
      navigate(`/listing/${data.listing._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Property Details...
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-5">
        <div className="flex flex-col gap-4 flex-1 p-5">
          <input
            onChange={handleChange}
            value={formData.name}
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            onChange={handleChange}
            value={formData.description}
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            maxLength="202"
            minLength="10"
            required
          />
          <input
            onChange={handleChange}
            value={formData.address}
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="10"
            required
          />
          <div className="flex justify-between flex-wrap">
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "sale"}
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type === "rent"}
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.parking === true}
                type="checkbox"
                id="parking"
                className="w-5"
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.furnished === true}
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.offer === true}
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-between my-5">
            <div className="flex items-center gap-5 my-2">
              <input
                onChange={handleChange}
                value={formData.bedrooms}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedroom"
                min="1"
                max="10"
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-5 my-2">
              <input
                onChange={handleChange}
                value={formData.bathrooms}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathroom"
                min="1"
                max="10"
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-5 my-2">
              <input
                onChange={handleChange}
                value={formData.regularPrice}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="0"
                max="10000"
                required
              />
              <div>
                <p>Regular Price</p>
                <span className="text-xs text-red-700">(INR per month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-5">
                <input
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="p-3 border border-gray-300 rounded-lg"
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000"
                  required
                />
                <div>
                  <p>Discounted Price</p>
                  <span className="text-xs text-red-700">(INR per month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 p-5">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-5">
              The first image will be cover (max: 6)
            </span>
          </p>
          <div className="flex gap-4 mt-5">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="p-3 border border-gray-700 rounded w-full "
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg uppercase disabled:opacity-80"
            >
              {uploading ? "Uploading" : "Upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => {
              return (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="listing-image"
                    className="w-40 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button
            disabled={loading || uploading}
            className="mt-10 font-bold bg-zinc-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-50"
          >
            {loading ? "Creating your post...." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-xs">{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
