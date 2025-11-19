"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Kendi oluşturduğumuz parçalar
import LoginForm from "@/components/sections/auth/LoginForm";
import RegisterForm from "@/components/sections/auth/RegisterForm";
import GoogleAuthButton from "@/components/sections/auth/GoogleAuthButton";

export default function AuthPage() {
  const t = useTranslations("Auth");
  const [activeTab, setActiveTab] = useState("login");

  // Global hata/başarı mesajı
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Mesaj gösterme yardımcıları
  const handleError = (text: string) => setMessage({ type: "error", text });
  const handleSuccess = (text: string) => setMessage({ type: "success", text });
  const clearMessage = () => setMessage(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
      {/* Arka Plan Blob Efektleri */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-xl border-slate-100">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <CalendarDays size={24} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            {t("title")}
          </CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              clearMessage(); // Sekme değişince mesajı temizle
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t("tabs.login")}</TabsTrigger>
              <TabsTrigger value="register">{t("tabs.register")}</TabsTrigger>
            </TabsList>

            {/* Bildirim Alanı */}
            {message && (
              <div
                className={`p-3 mb-4 text-sm rounded-md animate-in fade-in slide-in-from-top-2 ${
                  message.type === "error"
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-green-50 text-green-600 border border-green-100"
                }`}
              >
                {message.text}
              </div>
            )}

            <TabsContent value="login">
              <LoginForm onError={handleError} />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm onSuccess={handleSuccess} onError={handleError} />
            </TabsContent>
          </Tabs>

          {/* Veya Ayırıcı */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Veya</span>
            </div>
          </div>

          {/* Google Butonu */}
          <GoogleAuthButton />
        </CardContent>
      </Card>
    </div>
  );
}
