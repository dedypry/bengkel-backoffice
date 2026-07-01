import type { Control } from "react-hook-form";

import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Textarea,
} from "@heroui/react";
import { ClipboardList, Plus, Trash2 } from "lucide-react";

import {
  DEFAULT_NEXT_SERVICE_NOTES,
  parseNextServiceNotes,
} from "@/utils/helpers/next-service-notes";

type NextServiceNotesFieldProps = {
  control: Control<any>;
  name?: string;
};

export default function NextServiceNotesField({
  control,
  name = "next_service_notes",
}: NextServiceNotesFieldProps) {
  const [draft, setDraft] = useState("");
  const [inputMode, setInputMode] = useState<"preset" | "custom">("preset");

  const presetItems = useMemo(
    () =>
      DEFAULT_NEXT_SERVICE_NOTES.map((note, index) => ({
        key: `preset-${index}`,
        label: note,
      })),
    [],
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const notes = parseNextServiceNotes(field.value);

        const addNote = (text: string) => {
          const value = text.trim();

          if (!value || notes.includes(value)) {
            return;
          }

          field.onChange([...notes, value]);
          setDraft("");
        };

        const removeNote = (index: number) => {
          field.onChange(notes.filter((_, idx) => idx !== index));
        };

        return (
          <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white p-2 text-amber-600 shadow-sm">
                <ClipboardList size={18} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase text-gray-600">
                  Template Rekomendasi Servis
                </h4>
                <p className="text-xs text-gray-500">
                  Dipakai di &quot;Rekomendasi Servis Selanjutnya&quot; pada
                  work order. Pilih preset atau buat catatan custom.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                color={inputMode === "preset" ? "primary" : "default"}
                size="sm"
                variant={inputMode === "preset" ? "flat" : "bordered"}
                onPress={() => setInputMode("preset")}
              >
                Pilih Preset
              </Button>
              <Button
                color={inputMode === "custom" ? "primary" : "default"}
                size="sm"
                variant={inputMode === "custom" ? "flat" : "bordered"}
                onPress={() => setInputMode("custom")}
              >
                Catatan Custom
              </Button>
            </div>

            {inputMode === "preset" ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <Autocomplete
                  allowsCustomValue
                  className="flex-1"
                  inputValue={draft}
                  label="Cari / pilih template"
                  placeholder="Ketik atau pilih rekomendasi..."
                  variant="bordered"
                  onInputChange={setDraft}
                  onSelectionChange={(key) => {
                    const selected = presetItems.find(
                      (item) => item.key === key,
                    );

                    if (selected) {
                      setDraft(selected.label);
                    }
                  }}
                >
                  {presetItems.map((item) => (
                    <AutocompleteItem key={item.key} textValue={item.label}>
                      {item.label}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <Button
                  className="sm:self-end"
                  color="primary"
                  startContent={<Plus size={16} />}
                  variant="flat"
                  onPress={() => addNote(draft)}
                >
                  Tambah
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea
                  label="Catatan custom"
                  minRows={3}
                  placeholder="Contoh: Periksa kebocoran oli mesin dan seal kop..."
                  value={draft}
                  variant="bordered"
                  onValueChange={setDraft}
                />
                <Button
                  color="primary"
                  startContent={<Plus size={16} />}
                  variant="flat"
                  onPress={() => addNote(draft)}
                >
                  Tambah Catatan Custom
                </Button>
              </div>
            )}

            {notes.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase text-gray-500">
                  Template tersimpan ({notes.length})
                </p>
                <div className="rounded-lg border border-amber-100/80 bg-white divide-y divide-amber-50 overflow-hidden">
                  {notes.map((note, index) => (
                    <div
                      key={`${note}-${index}`}
                      className="flex items-center gap-2 px-3 py-2 min-h-0"
                    >
                      <p className="flex-1 text-sm text-gray-700 leading-snug">
                        {note}
                      </p>
                      <Button
                        isIconOnly
                        className="shrink-0"
                        color="danger"
                        radius="full"
                        size="sm"
                        variant="light"
                        onPress={() => removeNote(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Chip color="warning" size="sm" variant="flat">
                Belum ada template. Tambahkan minimal 1 catatan rekomendasi.
              </Chip>
            )}
          </section>
        );
      }}
    />
  );
}
