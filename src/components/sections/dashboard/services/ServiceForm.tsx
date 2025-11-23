"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createServiceSchema,
  ServiceFormValues,
} from "@/lib/validations/service";
import { Service } from "@/types/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createService, updateService } from "@/actions/services";
import { toast } from "sonner";
import { useEffect } from "react";

interface ServiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceToEdit?: Service | null;
  onClose: () => void;
}

export function ServiceForm({
  open,
  onOpenChange,
  serviceToEdit,
  onClose,
}: ServiceFormProps) {
  const t = useTranslations("ServicesPage");
  const form = useForm<ServiceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createServiceSchema(t)) as any,
    defaultValues: {
      name: "",
      description: "",
      duration: 30,
      price: 0,
      currency: "USD",
    },
  });

  useEffect(() => {
    if (serviceToEdit) {
      form.reset({
        name: serviceToEdit.name,
        description: serviceToEdit.description || "",
        duration: serviceToEdit.duration,
        price: serviceToEdit.price,
        currency: serviceToEdit.currency,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        duration: 30,
        price: 0,
        currency: "USD",
      });
    }
  }, [serviceToEdit, form, open]);

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      if (serviceToEdit) {
        await updateService(serviceToEdit.id, data);
        toast.success(t("toasts.updated"));
      } else {
        await createService(data);
        toast.success(t("toasts.created"));
      }
      onClose();
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {serviceToEdit ? t("editService") : t("addService")}
          </DialogTitle>
          <DialogDescription>
            {serviceToEdit ? t("subtitle") : t("subtitle")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.placeholders.name")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("form.placeholders.description")}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.duration")}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.price")}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.currency")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.placeholders.selectCurrency")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="TRY">TRY (₺)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {serviceToEdit ? t("form.save") : t("form.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
