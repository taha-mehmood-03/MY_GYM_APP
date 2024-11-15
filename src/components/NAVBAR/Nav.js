import { Navbar as NextNavbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";

function Nav() {
    return (
        <NextNavbar 
            className="bg-gradient-to-br from-black via-gray-900 to-black text-white shadow-lg"
            maxWidth="xl"
        >
            <NavbarBrand>
                <p className="font-bold text-purple-500 text-2xl">FIT4</p>
            </NavbarBrand>

            <NavbarContent justify="end">
                {/* Login Link */}
                <NavbarItem className="hidden lg:flex">
                    <Link 
                        href="./ToLogin" 
                        className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
                    >
                        Login
                    </Link>
                </NavbarItem>

                {/* Sign Up Button */}
                <NavbarItem>
                    <Button 
                        as={Link} 
                        color="primary" 
                        href="./" 
                        variant="flat" 
                        className="bg-purple-500 text-white hover:bg-purple-400 transition-all duration-300"
                    >
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </NextNavbar>
    );
}

export default Nav;
