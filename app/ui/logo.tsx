import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { prociono } from "@/app/ui/fonts";

export default function Logo() {
   return (
      <div
         className={`${prociono.className} flex flex-row items-center leading-none text-black`}
      >
         <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
         <p className="text-[44px]">Event Sorcerer</p>
      </div>
   );
}
