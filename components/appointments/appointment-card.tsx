"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { FaCalendar, FaClock } from "react-icons/fa6";
import type { Appointment, AppointmentStatus } from "@/types";

const STATUS_COLORS: Record<AppointmentStatus, "success" | "primary" | "danger"> = {
  upcoming: "success",
  completed: "primary",
  cancelled: "danger",
};

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
}

/** Reusable card for a single booking (upcoming / history). */
export function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  return (
    <Card shadow="sm" className="border border-gray-100">
      <CardBody className="gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-gray-900">
              {appointment.serviceName}
            </p>
            <p className="text-xs text-gray-500">{appointment.providerName}</p>
          </div>
          <Chip
            size="sm"
            variant="flat"
            color={STATUS_COLORS[appointment.status]}
            className="font-semibold capitalize"
          >
            {appointment.status}
          </Chip>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <FaCalendar /> {appointment.date}
          </span>
          <span className="flex items-center gap-1.5">
            <FaClock /> {appointment.startTime}–{appointment.endTime}
          </span>
          <span className="font-semibold text-indigo-600">
            ${appointment.totalPrice} {appointment.currency}
          </span>
        </div>

        {appointment.status === "upcoming" && (
          <Button
            color="danger"
            variant="bordered"
            radius="lg"
            size="sm"
            className="mt-1 w-full font-semibold"
            onPress={() => onCancel(appointment.id)}
          >
            Cancel Appointment
          </Button>
        )}

        {appointment.status === "cancelled" && appointment.cancelledAt && (
          <p className="text-xs text-gray-400">
            Cancelled: {new Date(appointment.cancelledAt).toLocaleString()}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
