import react from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase.js";

import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../store/user/userSlice.js";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  // console.log(file);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({ avatar: currentUser.photoURL });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
      // setFile(undefined);
    }
  }, [file]);
  function handleFileUpload(file) {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const metadata = {
      contentType: "image/jpeg",
    };
    // console.log(fileName);
    const storageRef = ref(storage, `avatar/${fileName}`);
    // console.log(storageRef);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ` + progress + "%done.");
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        // console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          // console.log(formData);
        });
      }
    );
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });

    // console.log(formData);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(currentUser);
    try {
      dispatch(updateUserStart());
      const result = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await result.json();

      if (data.status == "fail") {
        dispatch(updateUserFailure(data.message));
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  async function handleDeleteUser() {
    try {
      console.log(currentUser);
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.status == "fail") {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }
  async function handleSignOut() {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data.message));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  async function handleShowListings() {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      // console.log(data);
      if (data.success == "fail") {
        setShowListingError(true);
        return;
      }
      setUserListings(data.listings);
      console.log(userListings);
    } catch (error) {
      setShowListingError(true);
    }
  }

  async function handleListingDelete(listingId) {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.status == "fail") {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-stone-700 font-semibold text-center mt-10">
        Hello, {currentUser && currentUser.username}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          className="m-10 self-center rounded-full h-24 w-24 object-cover cursor-pointer"
          src={formData.avatar || currentUser.avatar}
          alt="profile image"
          onClick={() => fileRef.current.click()}
        />
        <div className="self-center text-sm mt-0">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image Upload(Image must be less than 2 mB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700 text=bold ">
              {" "}
              {`Uploading ${filePerc}%`}
            </span>
          ) : (
            <span className="text-green-700">Image uploaded.</span>
          )}
        </div>

        <input
          defaultValue={currentUser.username}
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="font-bold bg-zinc-700 text-orange-400 rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Loading" : "Update"}
        </button>

        <Link
          to={"/create-listing"}
          className="font-bold bg-green-700 text-center rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-50"
        >
          List your Property
        </Link>
      </form>
      <div className="mt-2 flex items-center justify-between">
        <span
          className="text-rose-600 cursor-pointer font-bold"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span
          className="text-sky-600 cursor-pointer font-bold"
          onClick={handleSignOut}
        >
          Sign Out
        </span>
      </div>

      <p className="text-rose-600  mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User is updated successfully." : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingError && "Error Showing Listing."}
      </p>

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl">Your Listings</h1>
          {userListings.map((listing) => {
            return (
              <div
                className="flex border rounded-lg p-5 justify-between items-center"
                key={listing._id}
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    className="h-16 w-16 object-contain"
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold hover:underline truncate flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col item-center">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <button className="text-green-700 uppercase">Edit</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Profile;
