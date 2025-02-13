import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col md:flex-row items-stretch">
        <div className="p-10 flex flex-col bg-[#f2f2f2] dark:bg-[#151414]">
          <h1 className="text-5xl font-medium mb-4">Welcome to DropBox.</h1>
          <h2 className="text-4xl">
            Storing everything for you and your business needs, All in oneplace.
          </h2>
          <p className="pt-10 pb-20">
            Enhance your personal storage with Dropbox, Offering simple and
            efficient way to upload, organize, and access your files from
            anywhere. Securely store important documents and media, and
            experience the convinience of easy file management and sharing in
            one centralized solution.
          </p>
          <Link
            href="/dashboard"
            className="flex bg-blue-700 hover:bg-blue-600 transition-colors rounded px-5 py-3 text-white w-fit"
          >
            Try it for free!
            <ArrowRightIcon className="ml-2" />
          </Link>
        </div>
        <div className="bg-[#1e1919] dark:bg-slate-800 p-10">
          <video autoPlay loop muted className="rounded-lg">
            <source
              src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/overview/lp-header-graphite200-1920x1080.mp4"
              type="video/mp4"
            />
            Your Browser does not support video
          </video>
        </div>
      </div>
    </main>
  );
}
