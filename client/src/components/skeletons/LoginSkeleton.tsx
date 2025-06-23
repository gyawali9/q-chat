const LoginSkeleton = () => {
  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 md:justify-evenly backdrop-blur-2xl px-4 pt-8 md:pt-0 animate-pulse">
      {/* Left: Logo Placeholder */}
      <div
        className="
          h-auto
          w-[30vw]
          md:w-[60vw]
          lg:w-[max(40vw,250px)]
          aspect-square
          bg-gray-100/50
          rounded-md
        "
      />

      {/* Right: Form Skeleton */}
      <div className="border-2 bg-white/10 border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg max-w-md w-full text-white">
        {/* Title bar (Sign up) */}
        <div className="h-7 w-32 bg-gray-300 rounded-md" />

        {/* Full Name */}
        <div className="h-10 bg-gray-300 rounded-md" />

        {/* Email */}
        <div className="h-10 bg-gray-300 rounded-md" />

        {/* Password */}
        <div className="h-10 bg-gray-300 rounded-md" />

        {/* Textarea (Bio) */}
        <div className="h-24 bg-gray-300 rounded-md" />

        {/* Submit Button */}
        <div className="h-12 bg-gradient-to-r from-purple-400 to-violet-600 rounded-md" />

        {/* Checkbox + Terms */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-gray-400 rounded-sm" />
          <div className="h-4 w-3/4 bg-gray-400 rounded-md" />
        </div>

        {/* Footer Text */}
        <div className="h-4 w-full bg-gray-400 rounded-md" />
        <div className="h-4 w-2/3 bg-gray-400 rounded-md" />
      </div>
    </div>
  );
};

export default LoginSkeleton;
