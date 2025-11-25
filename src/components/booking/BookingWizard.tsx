"use client";

import { toast } from "sonner";
import {
  getOrganizationStaff,
  getAvailableSlots,
  createAppointment,
  StaffMember,
  TimeSlot,
} from "@/actions/booking";
import { useTranslations } from "next-intl";
import { Service } from "@/types/service";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { Loader2, Check, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BookingWizardProps {
  organizationId: string;
  services: Service[];
  preSelectedServiceId?: string;
}

export default function BookingWizard({
  organizationId,
  services,
  preSelectedServiceId,
}: BookingWizardProps) {
  const t = useTranslations("BookingWizard");
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);

  // Selection State
  const [selectedService, setSelectedService] = useState<Service | null>(
    services.find((s) => s.id === preSelectedServiceId) || null
  );
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Data State
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Fetch Staff when Service is selected
  useEffect(() => {
    if (selectedService && step === 2) {
      const fetchStaff = async () => {
        setLoading(true);
        try {
          const staff = await getOrganizationStaff(organizationId);
          setStaffMembers(staff);
        } catch {
          toast.error(t("errors.loadStaff"));
        } finally {
          setLoading(false);
        }
      };
      fetchStaff();
    }
  }, [selectedService, step, organizationId, t]);

  // Fetch Slots when Staff & Date are selected
  useEffect(() => {
    if (selectedStaff && selectedDate && step === 3) {
      const fetchSlots = async () => {
        setLoading(true);
        try {
          const slots = await getAvailableSlots(
            selectedStaff.id,
            selectedService!.duration,
            format(selectedDate, "yyyy-MM-dd")
          );
          setTimeSlots(slots);
        } catch {
          toast.error(t("errors.loadSlots"));
        } finally {
          setLoading(false);
        }
      };
      fetchSlots();
    }
  }, [selectedStaff, selectedDate, step, selectedService, t]);

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleBook = async () => {
    if (!selectedService || !selectedStaff || !selectedTime) return;

    setLoading(true);
    try {
      await createAppointment({
        organizationId,
        serviceId: selectedService.id,
        staffId: selectedStaff.id,
        startTime: selectedTime,
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        price: selectedService.price,
      });
      toast.success(t("toasts.success"));
      nextStep(); // Go to success step
    } catch {
      toast.error(t("errors.bookError"));
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
      {/* Header / Progress */}
      <div className="bg-slate-50 p-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            {step === 1 && t("steps.service")}
            {step === 2 && t("steps.staff")}
            {step === 3 && t("steps.datetime")}
            {step === 4 && t("steps.details")}
            {step === 5 && t("steps.confirmed")}
          </h2>
          <div className="text-sm text-slate-500 font-medium">
            {t("steps.progress", { step })}
          </div>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 relative overflow-y-auto max-h-[calc(100dvh-300px)]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {/* Step 1: Services */}
            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                      selectedService?.id === service.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-transparent hover:border-slate-200"
                    }`}
                    onClick={() => {
                      setSelectedService(service);
                      nextStep();
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">
                          {service.name}
                        </h3>
                        <span className="font-bold text-blue-600">
                          {service.price} {service.currency}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center text-slate-400 text-sm">
                        <Clock size={16} className="mr-1" />
                        {service.duration} mins
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Step 2: Staff */}
            {step === 2 && (
              <div className="grid md:grid-cols-3 gap-4">
                {loading ? (
                  <div className="col-span-3 flex justify-center py-12">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                  </div>
                ) : (
                  staffMembers.map((staff) => (
                    <Card
                      key={staff.id}
                      className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                        selectedStaff?.id === staff.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-transparent hover:border-slate-200"
                      }`}
                      onClick={() => {
                        setSelectedStaff(staff);
                        nextStep();
                      }}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <Avatar className="w-20 h-20 mb-4 border-4 border-white shadow-sm">
                          <AvatarImage src={staff.avatarUrl} />
                          <AvatarFallback className="text-xl bg-slate-100">
                            {staff.fullName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-lg">
                          {staff.fullName}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          {t("staff.role")}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div className="flex flex-col h-full">
                {/* Date Picker */}
                <div className="flex overflow-x-auto pb-4 gap-2 mb-6 no-scrollbar">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const date = addDays(new Date(), i);
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(date)}
                        className={`shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white shadow-lg scale-105"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                        }`}
                      >
                        <span className="text-xs font-medium uppercase">
                          {format(date, "EEE")}
                        </span>
                        <span className="text-xl font-bold">
                          {format(date, "d")}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots */}
                <div className="flex-1">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    {t("datetime.availableSlots")}
                  </h3>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader2
                        className="animate-spin text-blue-600"
                        size={32}
                      />
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      {t("datetime.noSlots")}
                    </div>
                  ) : (
                    <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.startTime}
                            variant={
                              selectedTime === slot.startTime
                                ? "default"
                                : "outline"
                            }
                            className={`w-full ${
                              !slot.available
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.startTime)}
                          >
                            {format(parseISO(slot.startTime), "HH:mm")}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Details */}
            {step === 4 && (
              <div className="max-w-md mx-auto space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    {t("summary.title")}
                  </h3>
                  <div className="space-y-1 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>{t("summary.service")}</span>
                      <span className="font-medium">
                        {selectedService?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("summary.professional")}</span>
                      <span className="font-medium">
                        {selectedStaff?.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("summary.date")}</span>
                      <span className="font-medium">
                        {format(selectedDate, "PPP")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("summary.time")}</span>
                      <span className="font-medium">
                        {selectedTime &&
                          format(parseISO(selectedTime), "HH:mm")}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-200 mt-2">
                      <span>{t("summary.price")}</span>
                      <span className="font-bold">
                        {selectedService?.price} {selectedService?.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("form.fullName")}</Label>
                    <Input
                      placeholder="John Doe"
                      value={customerDetails.name}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("form.email")}</Label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={customerDetails.email}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("form.phone")}</Label>
                    <Input
                      placeholder="+1 234 567 890"
                      value={customerDetails.phone}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                  <Check size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {t("success.title")}
                </h2>
                <p className="text-slate-500 max-w-md mb-8">
                  {t("success.description", { email: customerDetails.email })}
                </p>
                <Button onClick={() => window.location.reload()}>
                  {t("success.bookAnother")}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Actions */}
      {step < 5 && (
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 1 || loading}
            className="text-slate-500"
          >
            <ChevronLeft size={18} className="mr-1" /> {t("actions.back")}
          </Button>

          {step === 3 && (
            <Button
              onClick={nextStep}
              disabled={!selectedTime || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t("actions.continue")}{" "}
              <ChevronRight size={18} className="ml-1" />
            </Button>
          )}

          {step === 4 && (
            <Button
              onClick={handleBook}
              disabled={
                !customerDetails.name || !customerDetails.email || loading
              }
              className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                t("actions.confirm")
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
