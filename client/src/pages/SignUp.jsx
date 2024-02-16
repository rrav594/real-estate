import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.status === "fail") {
      setError(data.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setError(null);
    navigate("/");
  };

  return (
    <div className="mt-[100px] p-10">
      <div className="p-3 mx-auto max-w-lg shadow-lg bg-zinc-300">
        <div className="flex flex-col items-center">
          <h1 className="font-serif text-3xl text-zinc-700 font-semibold text-center my-7">
            Sign Up
          </h1>
          <p className="text-lg font-serif mb-7 text-stone-800">
            Use your email to create account!
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="your-name"
            className="border p-3 rounded-lg shadow-lg"
            id="username"
            onChange={handleChange}
          />
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
          <input
            type="password"
            placeholder="confirm password"
            className="border p-3 rounded-lg shadow-lg"
            id="passwordConfirm"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="bg-zinc-600 rounded-lg text-white p-4 shadow-lg uppercase font-bold hover:opacity-80 ease-in duration-300 disabled:opacity-80 disabled:text-zinc-300"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>

        <div className="flex items-center my-5 justify-between">
          <p className=" diaplay:block flex items-center justify-end gap-10 font-medium">
            Have an account?
            <FaLongArrowAltRight />
          </p>
          <Link to="/sign-in">
            <span className="font-semibold cursor-pointer ease-in duration-100 hover:font-bold hover:underline text-sky-900">
              Sign In
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

export default SignUp;
