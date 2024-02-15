import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="p-3 mx-auto max-w-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center my-7">Sign Up</h1>
      <form className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="jackDaniels"
          className="border p-3 rounded-lg shadow-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="jd@email.com"
          className="border p-3 rounded-lg shadow-lg"
          id="username"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg shadow-lg"
          id="password"
        />
        <input
          type="password"
          placeholder="confirm password"
          className="border p-3 rounded-lg shadow-lg"
          id="confirmPassword"
        />

        <button className="bg-zinc-600 rounded-lg text-white p-4 shadow-lg uppercase font-bold hover:opacity-80 ease-in duration-300 disabled:opacity-80 disabled:text-zinc-300">
          Submit
        </button>
      </form>

      <div className="flex items-center my-5 justify-between">
        <p className="font-medium">Have an account?</p>
        <Link to="/sign-in">
          <span className="font-semibold cursor-pointer ease-in duration-100 hover:font-bold hover:underline text-sky-900">
            Sign In
          </span>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
