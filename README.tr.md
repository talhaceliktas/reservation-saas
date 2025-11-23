<div align="center">

# BookIt - Rezervasyon SaaS Platformu

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[🇹🇷 Türkçe](README.tr.md) | [🇬🇧 English](README.md) | [🇩🇪 Deutsch](README.de.md) | [🇪🇸 Español](README.es.md) | [🇫🇷 Français](README.fr.md)

</div>

---

## 🇹🇷 BookIt - Rezervasyon SaaS Platformu

BookIt, küçük ve orta ölçekli işletmeler için tasarlanmış modern, tam kapsamlı bir rezervasyon ve randevu yönetim platformudur. İşletmelerin hizmetlerini, personelini ve randevularını yönetmelerine olanak tanırken, müşterileri için sorunsuz bir rezervasyon deneyimi sunar.

### 🚀 Özellikler

- **Çoklu Dil Desteği**: Türkçe, İngilizce, Almanca, İspanyolca ve Fransızca dillerinde tam yerelleştirme.
- **Kimlik Doğrulama**: Supabase Auth ile güvenli kullanıcı girişi ve yönetimi.
- **Organizasyon Yönetimi**: Birden fazla işletme profili oluşturma ve geçiş yapma imkanı.
- **Personel Yönetimi**: Ekip üyelerini davet etme, rol atama (Kurucu, Yönetici, Personel) ve yetki yönetimi.
- **Hizmetler & Fiyatlandırma**: Özel süre ve fiyatlandırma ile hizmet oluşturma, düzenleme ve silme.
- **Yönetim Paneli**: İşletmenin tüm yönlerini yönetmek için duyarlı bir panel.
- **Mobil Öncelikli Tasarım**: Mobil cihazlar için özel kenar çubuğu ve navigasyon ile tam uyumlu tasarım.

### 🛠️ Teknoloji Yığını

- **Framework**: Next.js 15 (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS
- **UI Bileşenleri**: Shadcn/ui
- **Veritabanı & Auth**: Supabase
- **Uluslararasılaştırma**: next-intl
- **Form Yönetimi**: React Hook Form & Zod
- **İkonlar**: Lucide React

### 🚦 Kurulum

1.  **Repoyu klonlayın:**

    ```bash
    git clone https://github.com/kullanici-adiniz/reservation-saas.git
    cd reservation-saas
    ```

2.  **Bağımlılıkları yükleyin:**

    ```bash
    npm install
    ```

3.  **Çevre Değişkenleri:**
    `env.example` dosyasının adını `.env.local` olarak değiştirin ve Supabase bilgilerinizi girin.

4.  **Geliştirme sunucusunu başlatın:**
    ```bash
    npm run dev
    ```
