function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white flex-col justify-center px-12">
        <h1 className="text-4xl font-bold mb-4">DevCollab</h1>
        <p className="text-lg opacity-90">
          Collaborate with developers, build amazing projects, and manage tasks efficiently.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-500 mb-6">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;