import Container from "./Container";
import Link from "next/link";

const Footer = () => {
    return (
        <div className="py-6">
            <Container>
                <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-base text-muted-foreground">
                        Developed by{" "}
                        <Link href="https://sumitdoescode.me" className="text-foreground underline decoration-border underline-offset-4" target="_blank">
                            sumitdoescode
                        </Link>
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default Footer;
