import type { IUser } from "@/utils/interfaces/IUser";

import {
  Avatar,
  Card,
  CardBody,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { Star, ClipboardCheck } from "lucide-react";

import { getAvatarByName } from "@/utils/helpers/global";
import { Rating } from "@/components/rating";
import { http } from "@/utils/libs/axios";
import { notify, notifyError } from "@/utils/helpers/notify";

interface Props {
  id: number;
  open: boolean;
  setOpen: (val: boolean) => void;
  onFinish: () => void;
  mechanics: IUser[];
}

interface IForm {
  id: number;
  rating: number;
  notes: string;
}

export default function ResultMechanic({
  id,
  open,
  setOpen,
  mechanics,
  onFinish,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState<IForm[]>([]);

  useEffect(() => {
    if (open) {
      setForms(
        mechanics.map((item) => ({
          id: item.id,
          rating: 0,
          notes: "",
        })),
      );
    }
  }, [mechanics, open]);

  function handleRating() {
    setLoading(true);
    const payload = {
      work_order_id: id,
      mechanics: forms,
    };

    http
      .post("/work-order/rating", payload)
      .then(({ data }) => {
        onFinish();
        setOpen(false);
        notify(data.message);
      })
      .catch((err) => notifyError(err))
      .finally(() => setLoading(false));
  }

  function handleSetForm(id: number, key: keyof IForm, value: any) {
    setForms((prevForms) => {
      const findIndex = prevForms.findIndex((e) => e.id === id);

      if (findIndex === -1) return prevForms;

      const newForms = [...prevForms];

      newForms[findIndex] = { ...newForms[findIndex], [key]: value };

      return newForms;
    });
  }

  const findUserForm = (userId: number) => forms.find((e) => e.id === userId);

  return (
    <Modal
      backdrop="blur"
      isOpen={open}
      scrollBehavior="inside"
      size="3xl"
      onOpenChange={setOpen}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Star className="text-warning fill-warning" size={20} />
                <span>Penilaian Hasil Kerja Mekanik</span>
              </div>
              <p className="text-tiny font-normal text-gray-400">
                Berikan evaluasi performa mekanik sebelum menyelesaikan Work
                Order #{id}
              </p>
            </ModalHeader>
            <ModalBody className="py-4">
              <div className="flex flex-col gap-4">
                {mechanics.map((user) => (
                  <Card
                    key={user.id}
                    className="border border-default-100"
                    shadow="sm"
                  >
                    <CardBody className="p-4">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Kolom Info Mekanik & Rating */}
                        <div className="flex flex-col gap-4 min-w-[200px]">
                          <div className="flex gap-3 items-center">
                            <Avatar
                              isBordered
                              radius="full"
                              size="md"
                              src={
                                user.profile?.photo_url ||
                                getAvatarByName(user.name)
                              }
                            />
                            <div className="flex flex-col">
                              <p className="font-bold text-small text-gray-700">
                                {user.name}
                              </p>
                              <p className="text-tiny text-gray-400 font-mono">
                                {user.nik}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <p className="text-tiny font-bold text-gray-500 uppercase tracking-wider">
                              Rating Kerja
                            </p>
                            <Rating
                              initialValue={findUserForm(user.id)?.rating}
                              onChange={(val: any) =>
                                handleSetForm(user.id, "rating", val)
                              }
                            />
                          </div>
                        </div>

                        {/* Divider Horizontal di Mobile, Vertical di Desktop */}
                        <Divider
                          className="hidden md:block h-24"
                          orientation="vertical"
                        />

                        {/* Kolom Catatan Evaluasi */}
                        <div className="flex-1">
                          <Textarea
                            classNames={{
                              label:
                                "text-tiny font-bold text-default-500 uppercase tracking-wider",
                              input: "text-small",
                            }}
                            label="Evaluasi & Catatan"
                            labelPlacement="outside"
                            minRows={2}
                            placeholder="Berikan penilaian objektif berdasarkan hasil kerja dan SOP..."
                            value={findUserForm(user.id)?.notes}
                            variant="bordered"
                            onChange={(e) =>
                              handleSetForm(user.id, "notes", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-default-100">
              <Button color="danger" variant="light" onPress={onClose}>
                Batal
              </Button>
              <Button
                className="font-bold text-white"
                color="success"
                isLoading={loading}
                startContent={!loading && <ClipboardCheck size={18} />}
                onPress={handleRating}
              >
                Konfirmasi & Selesaikan
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
