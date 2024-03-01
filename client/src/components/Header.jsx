import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-zinc-300 shadow-lg">
      <div className="flex mx-auto p-3 justify-between items-center max-w-6xl">
        <Link to="/About">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-zinc-500">Real</span>
            <span className="text-zinc-700">Estate</span>
          </h1>
        </Link>
        <form className="flex items-center bg-zinc-200 p-3 rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch />
        </form>
        <ul className="flex gap-6 font-bold">
          <Link to="/">
            <li className="hover:cursor-pointer hidden sm:inline text-zinc-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/About">
            <li className="hover:cursor-pointer hidden sm:inline text-zinc-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover "
                src={currentUser.avatar}
                alt="profile of the loggedin user"
              />
            ) : (
              <li className="hover:cursor-pointer sm:inline text-zinc-700 hover:underline">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
