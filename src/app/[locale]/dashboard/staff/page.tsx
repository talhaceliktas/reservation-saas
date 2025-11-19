"use client";

import { useTranslations } from "next-intl";
import { useStaffData } from "@/hooks/useStaffData";
import InviteMemberDialog from "@/dashboard/staff/InviteMemberDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Shield, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StaffPage() {
  const t = useTranslations("StaffPage");

  const {
    members,
    invitations,
    currentUserRole,
    loading,
    refresh,
    updateRole,
    removeMember,
    revokeInvitation,
  } = useStaffData();

  // Sadece Owner rollerle oynayabilir
  const isOwner = currentUserRole === "owner";
  const canManage = currentUserRole === "owner" || currentUserRole === "admin";

  if (loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t("header.title")}
          </h1>
          <p className="text-slate-500">{t("header.description")}</p>
        </div>
        {canManage && <InviteMemberDialog onSuccess={refresh} />}
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">
            {t("tabs.members")} ({members.length})
          </TabsTrigger>
          <TabsTrigger value="invitations">
            {t("tabs.invitations")} ({invitations.length})
          </TabsTrigger>
        </TabsList>

        {/* AKTİF ÜYELER TABLOSU */}
        <TabsContent value="members" className="mt-4">
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.user")}</TableHead>
                  <TableHead>{t("table.email")}</TableHead>
                  <TableHead>{t("table.role")}</TableHead>
                  <TableHead className="text-right">
                    {t("table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.profile?.avatar_url || ""} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                            {member.profile?.full_name
                              ?.substring(0, 2)
                              .toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {member.profile?.full_name || t("alerts.unnamed")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{member.profile?.email}</TableCell>
                    <TableCell>
                      {/* Rol Düzenleme (Sadece Owner ise) */}
                      {isOwner && member.role !== "owner" ? (
                        <Select
                          defaultValue={member.role}
                          onValueChange={(val) => updateRole(member.id, val)}
                        >
                          <SelectTrigger className="h-8 w-auto min-w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              {t("roles.admin")}
                            </SelectItem>
                            <SelectItem value="staff">
                              {t("roles.staff")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant={
                            member.role === "owner" ? "default" : "secondary"
                          }
                        >
                          {member.role === "owner" && (
                            <Shield className="w-3 h-3 mr-1 inline" />
                          )}
                          {t(`roles.${member.role}`) ||
                            member.role.toUpperCase()}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isOwner && member.role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm(t("alerts.removeConfirm"))) {
                              removeMember(member.id);
                            }
                          }}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* BEKLEYEN DAVETLER TABLOSU */}
        <TabsContent value="invitations" className="mt-4">
          <div className="rounded-md border bg-white">
            {invitations.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                {t("empty.invitations")}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("table.email")}</TableHead>
                    <TableHead>{t("table.assignedRole")}</TableHead>
                    <TableHead>{t("table.status")}</TableHead>
                    <TableHead className="text-right">
                      {t("table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {/* Rol ismini çeviriyoruz */}
                          {t(`roles.${invite.role}`) || invite.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1"
                        >
                          <Clock size={12} /> {t("status.pending")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {canManage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => revokeInvitation(invite.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {t("buttons.cancel")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
