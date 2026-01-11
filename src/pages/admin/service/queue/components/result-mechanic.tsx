import type { IUser } from "@/utils/interfaces/IUser";

import {
  Avatar,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  Textarea,
} from "@mui/joy";
import { useEffect, useState } from "react";

import Modal from "@/components/modal";
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
    setForms(
      mechanics.map((item) => ({
        id: item.id,
        rating: 0,
        notes: "",
      })),
    );
  }, [mechanics]);

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

      newForms[findIndex] = {
        ...newForms[findIndex],
        [key]: value,
      };

      return newForms;
    });
  }

  const findUser = (id: number) => forms.find((e) => e.id === id);

  return (
    <Modal
      isLoading={loading}
      open={open}
      size="xl"
      title="Penilaian Mekanik"
      onOpenChange={setOpen}
      onSave={handleRating}
    >
      <div className="flex flex-col gap-5">
        {mechanics.map((user) => (
          <Card key={user.id}>
            <CardContent>
              <div className="flex gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Avatar
                      src={
                        user.profile?.photo_url || getAvatarByName(user.name)
                      }
                    />
                    <div>
                      <p className="font-semibold text-md">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.nik}</p>
                    </div>
                  </div>
                  <Rating
                    initialValue={findUser(user.id)?.rating}
                    onChange={(val) => handleSetForm(user.id, "rating", val)}
                  />
                </div>

                <FormControl sx={{ width: "100%" }}>
                  <FormLabel>Evaluasi Kualitas Kerja Mekanik</FormLabel>
                  <Textarea
                    placeholder="Berikan penilaian objektif berdasarkan hasil kerja dan SOP yang diterapkan."
                    value={findUser(user.id)?.notes}
                    onChange={(e) =>
                      handleSetForm(user.id, "notes", e.target.value)
                    }
                  />
                </FormControl>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Modal>
  );
}
