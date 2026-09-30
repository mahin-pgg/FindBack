import { Link } from "react-router";

export default function PageNotFound() {
  return (
    <>
      <h1 className="text-4xl text-red-800 font-bold text-center my-5">404 - Page not found</h1>
      <p className="text-center"> The page you are trying to access does not exist</p>
      <div className="text-center"><Link to="/" className="text-blue-500 hover:underline">Go to Login Page</Link></div>
      
    </>
  );
}