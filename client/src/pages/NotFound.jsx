import {Link} from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-[80%] px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            404 - Not Found
          </h1>
          <p className="mt-2 text-gray-600">
            The page you are looking for does not exist.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block px-6 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
