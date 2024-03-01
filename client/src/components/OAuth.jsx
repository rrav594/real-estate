import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";

import { useDispatch } from "react-redux";
import { signInSuccess } from "../store/user/userSlice.js";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName, email, photoURL }),
      });
      const data = await res.json();

      dispatch(signInSuccess(data.data.user));
      navigate("/");
    } catch (error) {
      console.log("Could not sign with google", error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 rounded-lg text-white p-4 shadow-lg uppercase font-bold hover:opacity-80 ease-in duration-300 disabled:opacity-80 disabled:text-zinc-300"
    >
      Continue with google
    </button>
  );
}

export default OAuth;
