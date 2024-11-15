import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";

export default function Navthree() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar 
      className="bg-gradient-to-br from-black via-gray-900 to-black text-white shadow-lg"
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <p className="font-bold text-purple-500 text-2xl">FIT4</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link 
            href="./MainPage" 
            className="text-white hover:text-purple-400 transition duration-300"
          >
            Full Workout
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="./Calories" 
            className="text-white hover:text-purple-400 transition duration-300"
          >
            Calories
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            href="./Calender" 
            className="text-white hover:text-purple-400 transition duration-300"
          >
            Plan
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
      
        <NavbarItem>
          <Button 
            as={Link} 
            color="primary" 
            href="./ToLogin" 
            variant="flat" 
            className="bg-purple-500 hover:bg-purple-400 text-white transition-all duration-300"
          >
            Login other account
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Responsive Menu */}
      <NavbarMenu className="sm:hidden bg-gray-900">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className={`w-full text-white py-2 hover:bg-gray-700 ${
                index === 2 ? "text-blue-400" : ""
              } ${index === menuItems.length - 1 ? "text-red-400" : ""}`}
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
