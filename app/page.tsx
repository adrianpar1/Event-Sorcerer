import Logo from "@/app/ui/logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { prociono } from "@/app/ui/fonts";
import Image from "next/image";

export default function Page() {
   return (
      <main className="flex min-h-screen flex-col p-6">
         <div className="flex h-20 shrink-0 items-end rounded-lg bg-primary-500 p-4 md:h-52">
            <Logo />
         </div>
         <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
            <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
               <p
                  className={`${prociono.className} antialiased text-xl text-gray-800 md:text-3xl md:leading-normal `}
               >
                  Welcome to Event Sorcerer!
               </p>
               <Link
                  href="/login"
                  className="flex items-center gap-5 self-start rounded-lg bg-primary-500 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-primary-400 md:text-base"
               >
                  <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
               </Link>
            </div>
            <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
               {/* Add Hero Images Here */}
               <Image
                  src="/wizard.jpg"
                  width={750}
                  height={1000}
                  className="hidden md:block"
                  alt="Picture of a wizard"
               />
               <Image
                  src="/wizard.jpg"
                  width={465}
                  height={620}
                  className="block md:hidden"
                  alt="Picture of a wizard"
               />
            </div>
         </div>
      </main>
   );
}
