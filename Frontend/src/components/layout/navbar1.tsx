"use client";

import { Menu, LogOut, Pill } from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { CartDropdown } from "../modules/Store/CartDropdown";
import { authClient } from "@/lib/auth-client";
import SearchBar from "../modules/Store/SearchBar";

const Navbar1 = ({ initialCategories = [], logo = { url: "/", src: "/my-logo.png", alt: "MediStore" }, menu = [
  { title: "Home", url: "/" }, { title: "About", url: "/about" }, { title: "Contact", url: "/contact" }, { title: "Help Center", url: "/help" }, { title: "Dashboard", url: "/dashboard" },
], auth = { login: { title: "Login", url: "/login" }, signup: { title: "Sign up", url: "/signup" } }, className }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const categories = initialCategories;

  const handleLogout = async () => {
    await authClient.signOut({ fetchOptions: { onSuccess: () => { router.push("/login"); router.refresh(); } } });
  };

  return (
    <section className={cn("fixed left-0 right-0 top-0 z-[100] border-b bg-white/90 py-4 backdrop-blur-md dark:bg-black/90", className)}>
      <div className="container mx-auto px-4">
        <nav className="hidden items-center justify-between gap-4 lg:flex">
          <div className="flex items-center gap-6">
            <Link href={logo.url} className="flex shrink-0 items-center gap-2"><img src={logo.src} className="h-10 w-24 object-contain" alt={logo.alt} /></Link>
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item: any) => {
                  if (item.url === "/dashboard" && !session) return null;
                  return <NavigationMenuItem key={item.title}><NavigationMenuLink asChild><Link href={item.url} className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted", pathname === item.url ? "bg-blue-50/50 text-blue-600 dark:bg-blue-900/20" : "text-slate-600 dark:text-slate-300")}>{item.title}</Link></NavigationMenuLink></NavigationMenuItem>;
                })}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn("font-bold text-blue-600", pathname.startsWith("/store") && "bg-blue-50/50")}>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent><ul className="grid w-[310px] gap-1 p-3">{categories.length ? categories.map((cat: any) => <li key={cat.id}><NavigationMenuLink asChild><Link href={`/store/${cat.id}`} className="flex items-center gap-3 rounded-md p-3 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-slate-800"><Pill className="size-4 text-blue-600" />{cat.categoryName}</Link></NavigationMenuLink></li>) : <li className="p-3 text-center text-sm text-muted-foreground">Categories are being added.</li>}</ul></NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex max-w-xl flex-1 items-center justify-end gap-3">
            <div className="relative z-[110] max-w-xs flex-1"><SearchBar /></div>
            <div className="flex shrink-0 items-center gap-2"><CartDropdown /><ModeToggle />{!isPending && (session ? <Button variant="destructive" size="sm" onClick={handleLogout} className="h-8"><LogOut className="mr-1 size-4" />Logout</Button> : <div className="flex gap-2"><Button asChild variant="outline" size="sm" className="h-8"><Link href={auth.login.url}>Login</Link></Button><Button asChild size="sm" className="h-8"><Link href={auth.signup.url}>Sign up</Link></Button></div>)}</div>
          </div>
        </nav>
        <div className="flex items-center justify-between lg:hidden">
          <Link href={logo.url}><img src={logo.src} className="h-9 w-20 object-contain" alt={logo.alt} /></Link>
          <div className="flex items-center gap-2">
            <SearchBar /><CartDropdown /><ModeToggle />
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="icon" aria-label="Open menu"><Menu className="size-4" /></Button></SheetTrigger>
              <SheetContent side="right"><div className="flex flex-col gap-2 px-5 pt-20">
                <Accordion type="single" collapsible><AccordionItem value="categories" className="border-none"><AccordionTrigger className="text-md font-bold text-blue-600">Categories</AccordionTrigger><AccordionContent className="flex flex-col gap-2 pl-4">{categories.map((cat: any) => <Link key={cat.id} href={`/store/${cat.id}`} className="border-b border-slate-100 py-2 text-sm text-slate-700">{cat.categoryName}</Link>)}</AccordionContent></AccordionItem></Accordion>
                {menu.filter((item: any) => item.url !== "/dashboard" || session).map((item: any) => <Link key={item.title} href={item.url} className={cn("block border-b py-3 text-md font-semibold", pathname === item.url ? "border-l-4 border-blue-600 pl-2 text-blue-600" : "text-slate-700 dark:text-slate-200")}>{item.title}</Link>)}
                {!isPending && (session ? <Button variant="destructive" className="mt-5 w-full" onClick={handleLogout}><LogOut className="mr-2 size-4" />Logout</Button> : <div className="mt-5 flex flex-col gap-2"><Button asChild variant="outline" className="w-full"><Link href={auth.login.url}>Login</Link></Button><Button asChild className="w-full"><Link href={auth.signup.url}>Sign up</Link></Button></div>)}
              </div></SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar1 };
