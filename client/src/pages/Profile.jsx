import { useSelector } from "react-redux";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-stone-700 font-semibold text-center mt-10">
        Hello, {currentUser.username.toUpperCase()}
      </h1>
      <form className="flex flex-col gap-5">
        <img
          className="m-10 self-center rounded-full h-24 w-24 object-cover cursor-pointer"
          src={currentUser.avatar}
          alt="profile image"
        />
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
        <button className="bg-zinc-700 text-orange-400 rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-50">
          Update
        </button>
      </form>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-rose-700 cursor-pointer font-bold">
          Delete Account
        </span>
        <span className="text-sky-700 cursor-pointer font-bold">Sign Out</span>
      </div>
    </div>
  );
}

export default Profile;
