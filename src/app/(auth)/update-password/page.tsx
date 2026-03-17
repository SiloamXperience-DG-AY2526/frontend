import UpdatePasswordForm from '@/components/update-password/UpdatePasswordForm';
import Image from 'next/image';

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-dvh w-full bg-white">
      <div className="flex min-h-dvh w-full flex-col md:flex-row">

        {/* Left Form */}
        <div className="w-full md:w-3/5 bg-white md:h-dvh overflow-y-auto px-6 md:px-14 py-10 flex items-center">
          <UpdatePasswordForm />
        </div>

        {/* Right Image */}
        <div className="w-full md:w-2/5 px-6 md:px-10 py-6">
          <div className="hidden md:block">
            <div className="relative w-full h-[calc(100dvh-48px)] rounded-2xl overflow-hidden">
              <Image
                src="/assets/signup.png"
                alt="Update password"
                fill
                priority
                className="object-cover"
                sizes="40vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}