"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import Image from "next/image";

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Languages with flag images from flagcdn.com
  const languages = [
    { code: "tr", name: "Türkçe", flagCode: "tr" },
    { code: "en", name: "English", flagCode: "gb" },
    { code: "es", name: "Español", flagCode: "es" },
    { code: "de", name: "Deutsch", flagCode: "de" },
    { code: "fr", name: "Français", flagCode: "fr" },
  ];

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const currentLanguage = languages.find((l) => l.code === currentLocale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
          {currentLanguage && (
            <Image
              src={`https://flagcdn.com/w40/${currentLanguage.flagCode}.png`}
              alt={currentLanguage.name}
              width={24}
              height={18}
              className="rounded-sm"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className="cursor-pointer gap-3"
          >
            <Image
              src={`https://flagcdn.com/w40/${lang.flagCode}.png`}
              alt={lang.name}
              width={24}
              height={18}
              className="rounded-sm"
            />
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
