"use client";

import { useState } from "react";
import { acceptInvitation } from "@/actions/invitations";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function JoinButton({
  token,
  locale,
}: {
  token: string;
  locale: string;
}) {
  const t = useTranslations("JoinPage");
  const tErrors = useTranslations();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await acceptInvitation(token, locale);

      if (res && res.error) {
        toast.error(tErrors(res.error, res.details));
        setLoading(false);
      }
    } catch (error) {
      if (isRedirectError(error)) {
        return;
      }

      toast.error(tErrors("InvitationErrors.createMemberError"));
      setLoading(false);
    }
  };

  return (
    <Button
      type="button" // Form submit'i tetiklememesi için
      className="w-full bg-green-600 hover:bg-green-700 gap-2 h-11 shadow-md shadow-green-600/20"
      onClick={handleJoin}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <ArrowRight size={18} />
      )}
      {t("valid.buttonJoin")}
    </Button>
  );
}

function isRedirectError(error) {
  return (
    error?.message === "NEXT_REDIRECT" ||
    error?.digest?.startsWith("NEXT_REDIRECT")
  );
}
