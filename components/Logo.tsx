import Link from "next/link";

const Logo = () => {
    return (
        <Link href={"/"} className={`text-3xl font-bold tracking-tight uppercase text-primary`}>
            Strong
            <span className="text-white">ly</span>
        </Link>
    );
};

export default Logo;
