"use client";

import { useTranslations } from "next-intl";
import { Service } from "@/types/service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { deleteService } from "@/actions/services";
import { toast } from "sonner";
import { useState } from "react";
import { ServiceForm } from "./ServiceForm";

interface ServiceListProps {
  initialServices: Service[];
}

export function ServiceList({ initialServices }: ServiceListProps) {
  const t = useTranslations("ServicesPage");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      toast.success(t("toasts.deleted"));
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingService(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsFormOpen(true)}>{t("addService")}</Button>
      </div>

      <ServiceForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        serviceToEdit={editingService}
        onClose={handleCloseForm}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead>{t("table.description")}</TableHead>
              <TableHead>{t("table.duration")}</TableHead>
              <TableHead>{t("table.price")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  {t("table.empty")}
                </TableCell>
              </TableRow>
            ) : (
              initialServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.description}</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell>
                    {service.price} {service.currency}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
