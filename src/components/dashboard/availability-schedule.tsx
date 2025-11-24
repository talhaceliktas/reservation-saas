"use client";

import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Availability } from "@/types/database";
import { updateAvailability } from "@/actions/availability";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

const dayKeys = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const availabilitySchema = z.object({
  schedule: z.array(
    z
      .object({
        day_of_week: z.number(),
        start_time: z.string(),
        end_time: z.string(),
        is_active: z.boolean(),
      })
      .refine(
        (data) => {
          if (!data.is_active) return true;
          return data.start_time < data.end_time;
        },
        {
          message: "startTimeBeforeEndTime",
          path: ["end_time"],
        }
      )
  ),
});

type AvailabilityFormValues = z.infer<typeof availabilitySchema>;

interface AvailabilityScheduleProps {
  initialData: Availability[];
}

export function AvailabilitySchedule({
  initialData,
}: AvailabilityScheduleProps) {
  const t = useTranslations("Availability");
  const [isPending, startTransition] = useTransition();

  // Initialize form with 7 days, merging with initialData
  const defaultSchedule = Array.from({ length: 7 }, (_, i) => {
    const existing = initialData.find((d) => d.day_of_week === i);
    return {
      day_of_week: i,
      start_time: existing?.start_time || "09:00:00",
      end_time: existing?.end_time || "17:00:00",
      is_active: existing?.is_active ?? false,
    };
  });

  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      schedule: defaultSchedule,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "schedule",
  });

  function onSubmit(data: AvailabilityFormValues) {
    startTransition(async () => {
      try {
        const updates = data.schedule.map((day) => {
          const existing = initialData.find(
            (d) => d.day_of_week === day.day_of_week
          );
          return {
            id: existing?.id,
            day_of_week: day.day_of_week,
            start_time: day.start_time,
            end_time: day.end_time,
            is_active: day.is_active,
          };
        });

        await updateAvailability(updates);
        toast.success(t("success"));
      } catch {
        toast.error(t("error"));
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
              >
                <div className="flex items-center gap-4 min-w-[150px]">
                  <FormField
                    control={form.control}
                    name={`schedule.${index}.is_active`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-5 w-5"
                          />
                        </FormControl>
                        <FormLabel className="font-medium cursor-pointer">
                          {t(`days.${dayKeys[index]}`)}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch(`schedule.${index}.is_active`) && (
                  <div className="flex items-center gap-2 flex-1">
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.start_time`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <span className="text-muted-foreground">-</span>
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.end_time`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.schedule?.[index]?.end_time
                              ?.message === "startTimeBeforeEndTime"
                              ? t("validation.startTimeBeforeEndTime")
                              : form.formState.errors.schedule?.[index]
                                  ?.end_time?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {!form.watch(`schedule.${index}.is_active`) && (
                  <div className="flex-1 text-sm text-muted-foreground italic">
                    {t("unavailable")}
                  </div>
                )}
              </div>
            ))}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("save")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
