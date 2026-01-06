import SignupForm from '@/components/signup/SignupForm';

export default function SignUp() {
  return (
    <div className="h-dvh overflow-hidden flex flex-col md:flex-row">
      {/* left */}
      <div className="md:w-1/2 bg-gray-200 flex flex-col justify-center items-center px-10 py-16">
        <div className="bg-white px-12 py-12 rounded-md w-fit mb-14 mx-auto">
          Include SiloamXperience pic as background
        </div>

        <h1 className="text-5xl text-center mt-3 font-bold text-black leading-snug">
          Sign Up as a <br />
          <span className="underline">Partner</span> here!
        </h1>
      </div>

      {/* right */}
      <div className="md:w-1/2 bg-white overflow-y-auto px-6 md:px-24 py-10">
        <SignupForm />
      </div>
    </div>
  );
}
