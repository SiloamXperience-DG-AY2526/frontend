import SignupForm from "@/components/signup/SignupForm";

export default function SignUp() {
  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="w-1/2 bg-gray-200 px-30 py-16">
        <div className="bg-white px-6 py-3 rounded-md w-fit mb-24">
          Include SiloamXperience pic as background
        </div>

        <h1 className="text-5xl text-center mt-3 font-bold text-black leading-snug">
          Sign Up as a <br />
          <span className="underline">Partner</span> here!
        </h1>
      </div>

      {/* RIGHT */}
      <div className="w-1/2 bg-white px-24 py-16">
        <SignupForm />
      </div>
    </div>
  );
}
