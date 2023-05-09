import Image from "next/image";
import Link from "next/link";

function Brand() {
  return (
    <Link href="/">
      <div className="flex w-auto items-center justify-between">
        <Image
          src="/logo.png"
          alt="logo"
          className="object-cover"
          width={80}
          height={80}
        />
        <h1 className="font-pacifico text-3xl not-italic leading-[7rem] text-black/80 md:text-4xl lg:text-5xl">
          Infinity
        </h1>
      </div>
    </Link>
  );
}
export default Brand;
