import Link from "next/link";

const Logo = () => {
    return (
        <Link href="/" className="text-2xl font-black tracking-[-0.04em] text-foreground sm:text-[1.7rem]">
            Strong<span className="text-primary">ly</span>
        </Link>
    );
};

export default Logo;
