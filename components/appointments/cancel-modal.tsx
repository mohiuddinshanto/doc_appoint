"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import type { Appointment } from "@/types";

interface CancelModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

/** Confirmation dialog for cancelling an upcoming appointment. */
export function CancelModal({
  appointment,
  isOpen,
  onOpenChange,
  onConfirm,
  isLoading,
}: CancelModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="md"
      placement="center"
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
    >
      <ModalContent>
        <ModalHeader className="text-lg font-bold text-gray-900">
          Cancel appointment?
        </ModalHeader>
        <ModalBody>
          {appointment && (
            <>
              <p className="text-sm font-semibold text-gray-700">
                {appointment.serviceName}
              </p>
              <p className="text-sm text-gray-500">
                {appointment.date} · {appointment.startTime}–
                {appointment.endTime}
              </p>
              <p className="mb-2 text-sm text-gray-500">
                The time slot will be freed immediately so others can book it.
              </p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            radius="lg"
            isDisabled={isLoading}
            onPress={() => onOpenChange(false)}
          >
            Keep Appointment
          </Button>
          <Button
            color="danger"
            radius="lg"
            isLoading={isLoading}
            onPress={onConfirm}
          >
            {isLoading ? "Cancelling…" : "Yes, Cancel"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
