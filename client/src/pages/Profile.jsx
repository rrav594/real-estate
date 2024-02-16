import react from "react";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase.js";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  // console.log(file);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  console.log(filePerc);
  const [formData, setFormData] = useState({});
  console.log(formData);
  console.log(fileUploadError);

  function handleFileUpload(file) {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    console.log(fileName);
    const storageRef = ref(storage, `avatar/${fileName}`);
    // console.log(storageRef);
    const uploadTask = uploadBytesResumable(storageRef, file);

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
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          console.log(formData);
        });
      }
    );
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-stone-700 font-semibold text-center mt-10">
        Hello, {currentUser.username.toUpperCase()}
      </h1>
      <form
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
        className="flex flex-col gap-5"
      >
        <input type="file" ref={fileRef} hidden accept="image/*" />
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
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="font-bold bg-zinc-700 text-orange-400 rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-50">
          Update
        </button>
      </form>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-rose-600 cursor-pointer font-bold">
          Delete Account
        </span>
        <span className="text-sky-600 cursor-pointer font-bold">Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
