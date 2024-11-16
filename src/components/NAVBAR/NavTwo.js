import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  NavbarMenuToggle,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import useInputValue from "@/hooks/useInputValue";
import { SearchIcon } from "./SearchIcon";
import { useSelector, useDispatch } from "react-redux";
import { setImages, clearSearch, searchExercises } from "@/STORE/specificBodySlice";
import { getImageManifest } from "@/utils/imageLoader";
import { useRouter } from "next/router";

export default function NavTwo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchInput = useInputValue("");
  const dispatch = useDispatch();
  const router = useRouter();

  const [imagesMap, setImagesMap] = useState({});
  
  const specificExercisesData = useSelector(
    (state) => state.specificBody.specificExercises
  );
  const specificExerciseImages = useSelector(
    (state) => state.specificBody.images
  );
  const specificBody = useSelector((state) => state.specificBody); 
  const normalizeName = (name) =>
    name.toLowerCase().replace(/\s+/g, "").replace(/\//g, "");

  useEffect(() => {
    async function initialize() {
      const manifest = await getImageManifest();
      setImagesMap(manifest);
    }

    initialize();
  }, []);

  const handleSearch = () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
  
    if (searchTerm) {
      const filteredExercises = specificExercisesData.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchTerm)
      );

      const filteredImages = filteredExercises.map((exercise) => {
        const normalizedExerciseName = normalizeName(exercise.name);
        return imagesMap[normalizedExerciseName] || null;
      }).filter((image) => image !== null);

      const combinedFilteredData = filteredExercises.map((exercise) => ({
        ...exercise,
        images: filteredImages.filter((image) =>
          image?.includes(normalizeName(exercise.name))
        ),
      }));

      dispatch(searchExercises(combinedFilteredData));
    } else {
      dispatch(clearSearch());
      dispatch(setImages(specificExerciseImages));
    }
  };

  const handleLogout = () => {
    router.push("/ToLogin");
  };

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
    <Navbar className="bg-gradient-to-br from-black via-gray-900 to-black text-white shadow-lg" onMenuOpenChange={setIsMenuOpen}
     maxWidth="xl">
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand className="mr-4">
          <p className="font-bold text-purple-500 text-2xl">FIT4</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="./MainPage" className="text-white hover:text-purple-400 transition duration-300">
              Full Workout
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="./Calories" className="text-white hover:text-purple-400 transition duration-300">
              Calories
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="./Calender" className="text-white hover:text-purple-400 transition duration-300">
              Plans
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          value={searchInput.value}
          onChange={searchInput.onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu className="sm:hidden bg-gray-900 text-white">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className={
                index === menuItems.length - 1 ? "text-red-500" : "hover:text-gray-400"
              }
              onClick={() => {
                if (item === "Log Out") handleLogout();
              }}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
