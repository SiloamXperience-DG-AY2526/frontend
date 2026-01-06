import SignupForm from '@/components/signup/SignupForm';

export default function SignUp() {
  return (
    <div className="min-h-screen flex overflow-x-hidden">
      {/* left half */}
      <div className="w-1/2 bg-gray-200 flex flex-col justify-center items-center px-30 py-16">
        <div className="bg-white px-12 py-12 rounded-md w-fit mb-14 mx-auto">
          Include SiloamXperience pic as background
        </div>

        <h1 className="text-5xl text-center mt-3 font-bold text-black leading-snug">
          Sign Up as a <br />
          <span className="underline">Partner</span> here!
        </h1>
      </div>  

      {/* right */}
      <div className="w-1/2 bg-white px-24  mt-10 overflow-y-auto">
        <SignupForm />
      </div>
    </div>
  );
}
