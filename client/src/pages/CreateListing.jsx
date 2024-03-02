import React from "react";

function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Property Details...
      </h1>
      <form className="flex flex-col sm:flex-row gap-5">
        <div className="flex flex-col gap-4 flex-1 p-5">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            maxLength="202"
            minLength="10"
            required
          />
          <input
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
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-between my-5">
            <div className="flex items-center gap-5 my-2">
              <input
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
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="1"
                max="10000"
                required
              />
              <div>
                <p>Regular Price</p>
                <span className="text-xs text-red-700">(INR per month)</span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="discountPrice"
                min="1"
                max="10000"
                required
              />
              <div>
                <p>Discounted Price</p>
                <span className="text-xs text-red-700">(INR per month)</span>
              </div>
            </div>
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
              className="p-3 border border-gray-700 rounded w-full "
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg uppercase disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className="mt-10 font-bold bg-zinc-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-50">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
