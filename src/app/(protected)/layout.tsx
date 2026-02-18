"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* Icons */
import { FiHome, FiInbox, FiMessageSquare } from "react-icons/fi";
import { IoMenuOutline } from "react-icons/io5";
import {
  MdTaskAlt,
  MdEventNote,
  MdOutlineSettings,
  MdSupportAgent,
} from "react-icons/md";
import { RiShareLine } from "react-icons/ri";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { BiSupport } from "react-icons/bi";
import {
  IoIosArrowDown,
  IoMdClose,
  IoMdNotificationsOutline,
} from "react-icons/io";
import {
  Globe,
  LogOut,
  Search,
  ChevronDown,
  User,
  Building2,
  Plus,
  PanelRightOpen,
} from "lucide-react";
import { Button } from "@radix-ui/themes";
// import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useCheckUser, useLogoutUser } from "@/hooks/useUserMutations";
import Loader from "@/components/shared/Loader";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActiveAccount } from "@/store/accoutStore";

// menu items
const menuItem = [
  { icon: <FiHome />, label: "Home", href: "/dashboard" },
  {
    icon: <MdTaskAlt />,
    label: "Action Center",
    href: "/dashboard/action-center",
  },
  {
    icon: <VscWorkspaceTrusted />,
    label: "Trust Center",
    href: "/dashboard/trust-center",
  },
  {
    icon: <MdEventNote />,
    label: "Work Ledger",
    href: "/dashboard/work-ledger",
  },
  { icon: <FiMessageSquare />, label: "Disputes", href: "/dashboard/disputes" },
  { icon: <FiInbox />, label: "Inbox", href: "/dashboard/inbox" },
  { icon: <RiShareLine />, label: "Share", href: "/dashboard/share" },
  {
    icon: <MdSupportAgent />,
    label: "Support Tickets",
    href: "/dashboard/support",
  },
  {
    icon: <MdOutlineSettings />,
    label: "Settings",
    href: "/dashboard/user-settings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ================= STATE ================= */
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading } = useCheckUser();
  const { mutate, isPending } = useLogoutUser();

  const pathname = usePathname();
  const router = useRouter();

  // zustand
  const { user, businesses, setUser, setBusinesses } = useAuthStore();
  const switchToBusiness = useActiveAccount((state) => state.switchToBusiness);
  const switchToPersonal = useActiveAccount((state) => state.switchToPersonal);
  const activeAccount = useActiveAccount();

  const activeBusiness = businesses.filter(
    (business) => business.id === activeAccount.id,
  );

  const handleLogout = () => {
    mutate();
  };
  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (data?.loggedIn) {
      setUser(data.user);
      setBusinesses(data.businessInfo);
    }
  }, [data, businesses, setUser, setBusinesses]);

  if (isLoading || (!data && !isLoading)) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`fixed top-0 h-screen overlfow-x-auto hidden lg:flex flex-col bg-gray-white shadow-xl border-r border-gray-100/60 transition-all duration-300 ${
          collapsed ? "w-17.5" : "w-65"
        }`}
      >
        <div className="">
          {/* Logo */}
          <div className="p-4 flex items-center justify-between  border-b border-slate-100">
            {!collapsed && (
              <Link href="/" className="flex items-center gap-2 font-bold">
                <span className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <VscWorkspaceTrusted className="text-white" />
                </span>
                AmrAstha
              </Link>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xl rounded-md p-1.5 text-gray-600"
            >
              {collapsed ? (
                <IoMenuOutline size={28} />
              ) : (
                <PanelRightOpen size={28} />
              )}
            </button>
          </div>
          {/* User */}
          <div className="px-4">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "w-full flex items-center justify-between bg-white py-2 outline-none rounded-lg",
                  !collapsed && "px-2  border border-gray-300",
                )}
              >
                <div className="flex items-center justify-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    {activeAccount.accountType === "personal" ? (
                      <User className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Building2 className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                  {activeAccount.accountType === "personal" && (
                    <div
                      className={`flex-1 min-w-0 transition-all duration-300 whitespace-nowrap text-start ${
                        collapsed
                          ? "opacity-0 -translate-x-5 w-0 overflow-hidden"
                          : "opacity-100 translate-x-0"
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  )}
                  {activeAccount.accountType === "business" && (
                    <div
                      className={`flex-1 min-w-0 transition-all duration-300 whitespace-nowrap text-start ${
                        collapsed
                          ? "opacity-0 -translate-x-5 w-0 overflow-hidden"
                          : "opacity-100 translate-x-0"
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {activeBusiness[0]?.businessName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {/* {user?.email} */}
                      </p>
                    </div>
                  )}
                </div>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>

              {/* The Content */}
              <DropdownMenuContent className="bg-white w-full rounded-none px-7 shadow-xl border-0">
                <div className="py-2">
                  <DropdownMenuLabel className="px-4 py-1 text-lg font-bold">
                    Choose Account
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    onClick={() => switchToPersonal(user?.id as string)}
                    className="flex cursor-pointer items-center justify-between px-4 py-3 focus:bg-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <span className="text-md">Personal</span>
                    </div>
                    <span className="rounded-full bg-black px-3 py-0.5 text-xs text-white">
                      Active
                    </span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-gray-200" />

                <div className="py-2">
                  <DropdownMenuLabel className="px-4 py-1 text-lg font-bold">
                    Businesses
                  </DropdownMenuLabel>

                  <DropdownMenuGroup>
                    {businesses.map((business) => (
                      <DropdownMenuItem
                        key={business.id}
                        onClick={() => switchToBusiness(business.id)}
                        className="flex cursor-pointer items-center gap-2 px-4 py-3 focus:bg-slate-100 text-md"
                      >
                        <Building2 className="h-5 w-5" />
                        <span>{business.businessName}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                      onClick={() =>
                        router.push("/dashboard/business/create-business")
                      }
                      className="flex cursor-pointer items-center gap-2 px-4 py-3 focus:bg-slate-100 text-md font-semibold"
                    >
                      <Plus className="h-5 w-5" />

                      <span> Create a business</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Menu */}
        <nav className="overflow-y-auto mt-3 flex flex-col gap-2 px-4">
          {menuItem.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all font-semibold",
                pathname === item.href
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-slate-600 hover:bg-emerald-100  hover:text-emerald-700 transition-all duration-300",
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span
                className={`transition-all duration-300 whitespace-nowrap ${
                  collapsed
                    ? "opacity-0 -translate-x-5 w-0 overflow-hidden"
                    : "opacity-100 translate-x-0"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        {/* Logout */}
        <div className="left-0 bottom-0 mt-2 px-4 pb-2 border-t border-slate-100">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className=" p-2 flex items-center w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
            // onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span
              className={`transition-all duration-300 whitespace-nowrap ${
                collapsed
                  ? "opacity-0 -translate-x-5 w-0 overflow-hidden"
                  : "opacity-100 translate-x-0"
              }`}
            >
              {isPending ? "Logging Out..." : "Logout"}
            </span>
          </Button>
        </div>
      </aside>

      <div
        className={cn(
          "flex-1 flex flex-col fix top-0 left-0 right-0",
          collapsed ? "lg:pl-17.5" : "lg:pl-65",
        )}
      >
        {/* ================= HEADER ================= */}
        <header className="right-0 flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-500/30">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden border border-gray-200/60 rounded-md p-1.5"
            >
              <IoMenuOutline />
            </button>
            {/* <div className="lg:w-auto w-7/10 flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 h-10 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div> */}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              // size="sm"
              // onClick={() => setLang(lang === 'BN' ? 'EN' : 'BN')}
              className="flex items-center justify-between"
            >
              <Globe className="h-5 w-5" /> EN
            </Button>

            <button className="border border-gray-200/60 rounded-full p-2">
              <IoMdNotificationsOutline />
            </button>

            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-md px-2 py-1"
              >
                <img
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04"
                  className="w-9 h-9 rounded-full"
                  alt="User"
                />
                <span className="hidden md:flex items-center gap-1 text-sm">
                  Musharof
                </span>
                <IoIosArrowDown />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-sm">Musharof Chowdhury</p>
                    <p className="text-xs text-gray-500">
                      randomuser@pimjo.com
                    </p>
                  </div>

                  <div className="py-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50">
                      <CgProfile /> Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50">
                      <MdOutlineSettings /> Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50">
                      <BiSupport /> Support
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <CiLogout /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 flex-1 bg-gray-50">{children}</main>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-white w-[260px] h-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">Dashboard</h2>
              <button onClick={() => setMobileOpen(false)}>
                <IoMdClose />
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              <ul>
                {menuItem.map((item, i) => (
                  <li key={i}>
                    <Link
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                        pathname === item.href
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                      href={item.href}
                    >
                      <span className="text-xl">{item.icon}</span> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
