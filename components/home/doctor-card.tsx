import { Avatar, Button, Card, CardBody } from "@heroui/react";
import { LuCalendar, LuClock, LuMapPin, LuStar } from "react-icons/lu";
import type { Service } from "@/types";

type DoctorCardProps = {
  doctor: Service;
  onBook: (doctor: Service) => void;
};

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <Card className="border border-slate-200">
      <CardBody className="gap-4">
        <div className="flex gap-3">
          <Avatar src={doctor.imageUrl} name={doctor.name} className="h-16 w-16" />

          <div>
            <p className="flex items-center gap-1 text-sm text-amber-500">
              <LuStar /> {doctor.rating} ({doctor.reviewCount})
            </p>
            <h3 className="font-bold">{doctor.name}</h3>
            <p className="text-sm text-indigo-600">{doctor.category}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600">{doctor.description}</p>
        <p className="flex items-center gap-2 text-sm text-slate-500"><LuMapPin /> {doctor.tags?.[2] || "Clinic"}</p>
        <p className="flex items-center gap-2 text-sm text-slate-500"><LuCalendar /> {doctor.availableDays?.join(", ")}</p>

        <div className="flex items-center justify-between">
          <b>${doctor.price}</b>
          <Button size="sm" color="primary" startContent={<LuClock />} onClick={() => onBook(doctor)}>
            Book Slot
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
