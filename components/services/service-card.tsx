"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
} from "@heroui/react";
import Image from "next/image";
import { FaRegClock, FaStar } from "react-icons/fa6";
import type { Service } from "@/types";

const CATEGORY_COLORS = {
  Wellness: "secondary" as const,
  Beauty: "danger" as const,
  Fitness: "warning" as const,
};

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

/** Reusable catalogue card for a single bookable service. */
export function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    <Card
      isPressable={false}
      shadow="sm"
      className="group flex flex-col overflow-hidden border border-gray-100 transition-all hover:border-indigo-200 hover:shadow-md"
    >
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        <Image
          src={service.imageUrl ?? "/placeholder.svg"}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 z-10">
          <Chip
            size="sm"
            variant="flat"
            color={CATEGORY_COLORS[service.category as keyof typeof CATEGORY_COLORS] ?? "default"}
            className="font-semibold"
          >
            {service.category}
          </Chip>
        </div>
      </div>

      <CardBody className="flex flex-1 flex-col gap-1 p-5">
        <h3 className="font-bold text-gray-900">{service.name}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-gray-500">
          {service.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FaRegClock /> {service.durationMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <FaStar className="text-amber-400" /> {service.rating} (
            {service.reviewCount})
          </span>
          <span className="text-sm font-semibold text-indigo-600">
            ${service.price}
          </span>
        </div>
      </CardBody>

      <CardFooter className="px-5 pb-5 pt-0">
        <Button
          color="primary"
          radius="lg"
          className="w-full font-semibold"
          onPress={() => onBook(service)}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}
