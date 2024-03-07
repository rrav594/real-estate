import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, []);

  return (
    <header className="bg-zinc-300 shadow-lg">
      <div className="flex mx-auto p-3 justify-between items-center max-w-6xl">
        <Link to="/About">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-zinc-500">Real</span>
            <span className="text-zinc-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-zinc-200 p-3 rounded-lg"
        >
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button>
            <FaSearch className="text-slate-700" />
          </button>
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
