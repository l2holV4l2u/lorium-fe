import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Breadcrumb({
  link,
  label,
}: {
  link: string[];
  label: string[];
}) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  return (
    <nav className="flex items-start space-x-2 text-gray-800 font-semibold w-full relative">
      {label.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <span className="text-gray-600">/</span>}
          <Link
            href={"/dashboard/" + link[index]}
            className={`hover:underline cursor-pointer ${
              index === label.length - 1 ? "text-primary-600" : ""
            }`}
            onClick={() => setIsLoading(link[index])}
          >
            {isLoading == link[index] ? (
              <div className="px-4">
                <LoaderCircle size={20} className="animate-spin text-primary" />
              </div>
            ) : (
              item
            )}
          </Link>
        </div>
      ))}
    </nav>
  );
}
