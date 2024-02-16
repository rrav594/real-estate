import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import {
  signInFailure,
  signInSuccess,
  siginInStart,
} from "../store/user/userSlice";
import OAuth from "../components/OAuth";

function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(siginInStart());
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data);
    if (data.status === "fail") {
      dispatch(signInFailure(data.message));
      return;
    }
    console.log(data);
    dispatch(signInSuccess(data.data.user));
    navigate("/");
  };

  return (
    <div className="mt-[100px] p-10">
      <div className="p-3 mx-auto max-w-lg shadow-lg bg-zinc-300">
        <div className="flex flex-col items-center">
          <h1 className="font-serif text-3xl text-zinc-700 font-semibold text-center mt-7">
            Sign In
          </h1>
          <p className="text-lg font-serif mb-7 text-stone-800">
            Use your RealEstate account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="example@your-mail.com"
            className="border p-3 rounded-lg shadow-lg"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            className="border p-3 rounded-lg shadow-lg"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-zinc-600 rounded-lg text-white p-4 shadow-lg uppercase font-bold hover:opacity-80 ease-in duration-300 disabled:opacity-80 disabled:text-zinc-300"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth />
        </form>

        <div className="flex items-center my-5 justify-between">
          <p className=" diaplay:block flex items-center justify-end gap-10 font-medium">
            Dont Have an account?
            <FaLongArrowAltRight />
          </p>
          <Link to="/sign-up">
            <span className="font-semibold cursor-pointer ease-in duration-100 hover:font-bold hover:underline text-sky-900">
              Register
            </span>
          </Link>
        </div>
        {error && (
          <p className="font-bold text-red-700 bg-red-200 rounded-m p-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default SignIn;
