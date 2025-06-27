// Pages/NotFoundPage.jsx
const NotFoundPage = ({ message = "404 | Page Not Found" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">{message}</h1>
      <p className="text-gray-600">The page you're looking for doesn't exist or access is restricted.</p>
    </div>
  );
};

export default NotFoundPage;
