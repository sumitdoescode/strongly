import Container from "./Container";
import Link from "next/link";

const Footer = () => {
    return (
        <div className="py-2">
            <Container>
                <div className="flex flex-col items-center justify-center text-center">
                    <p className="">
                        Developed by{" "}
                        <Link href="https://sumitdoescode.me" className="text-primary underline" target="_blank">
                            sumitdoescode
                        </Link>
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default Footer;
