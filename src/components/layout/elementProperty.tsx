import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { DndContext, DragOverEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { CSS } from "@dnd-kit/utilities";
import { RiDraggable } from "react-icons/ri";
import { nonInputFields } from "@lib/utils/const";
import { Toggle } from "@components/custom/toggle";
import { FormField } from "@lorium/prisma-zod";
import { FieldTypeEnum } from "@type/enum";

function DraggableChoice({
  choice,
  index,
  subindex,
  formFields,
  setFormFields,
}: {
  choice: string;
  index: number;
  subindex: number;
  formFields: FormField[];
  setFormFields: (fields: FormField[]) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: `choice-${subindex}` });
  return (
    <div
      className="flex items-center justify-center w-full gap-2"
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transform ? transition : undefined,
      }}
    >
      <RiDraggable
        size={28}
        {...listeners}
        {...attributes}
        className="focus:outline-none cursor-move"
      />
      <Input
        value={choice}
        onChange={(e) => {
          const updatedFields = [...formFields];
          updatedFields[index].choices[subindex] = e.target.value;
          setFormFields(updatedFields);
        }}
        placeholder={"ตัวเลือก " + (subindex + 1)}
      />
      <FaXmark
        size={14}
        onClick={() => {
          const updatedFields = [...formFields];
          updatedFields[index].choices = formFields[index].choices.filter(
            (_, i) => i !== subindex
          );
          setFormFields(updatedFields);
        }}
        className="cursor-pointer"
      />
    </div>
  );
}

export default function ElementProperty({
  index,
  setFocus,
  formFields,
  setFormFields,
}: {
  index: number;
  setFocus: (focus: number | null) => void;
  formFields: FormField[];
  setFormFields: (formFields: FormField[]) => void;
}) {
  if (index >= formFields.length) {
    setFocus(null);
    return <></>;
  }
  const type = formFields[index].type;

  // beware type error
  function updateData(field: string) {
    return (d: any) => {
      const updatedFields = [...formFields];
      (updatedFields[index] as any)[field] = d;
      setFormFields(updatedFields);
    };
  }

  function handleDragEnd(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const updatedFields = [...formFields];
    const choices = updatedFields[index].choices;
    const oldIndex = choices.findIndex((_, i) => `choice-${i}` === active.id);
    const newIndex = choices.findIndex((_, i) => `choice-${i}` === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    updatedFields[index].choices = arrayMove(choices, oldIndex, newIndex);
    setFormFields(updatedFields);
  }

  return (
    <div className="space-y-4">
      {!nonInputFields.includes(type) && (
        <Toggle
          label="จำเป็น"
          data={(formFields[index] as any)["required"]}
          setData={updateData("required")}
        />
      )}

      <div className="space-y-1">
        <Label htmlFor="header-input">
          {type == FieldTypeEnum.SECTION ? "หัวข้อ" : "คำถาม"}
        </Label>
        <Input
          id="header-input"
          value={(formFields[index] as any).header || ""}
          onChange={(e) => updateData("header")(e.target.value)}
          placeholder={type == FieldTypeEnum.SECTION ? "หัวข้อ" : "คำถาม"}
        />
      </div>

      {type === FieldTypeEnum.SECTION ? (
        <div className="space-y-1">
          <Label htmlFor="description-input">คำบรรยาย</Label>
          <Input
            id="description-input"
            value={(formFields[index] as any).description || ""}
            onChange={(e) => updateData("description")(e.target.value)}
            placeholder="คำบรรยาย"
          />
        </div>
      ) : type === FieldTypeEnum.SHORT_TEXT ||
        type === FieldTypeEnum.LONG_TEXT ? (
        <div className="space-y-1">
          <Label htmlFor="text-input">Placeholder</Label>
          <Input
            id="placeholder-input"
            value={(formFields[index] as any).placeholder || ""}
            onChange={(e) => updateData("placeholder")(e.target.value)}
            placeholder="Placeholder"
          />
        </div>
      ) : null}

      {(type === FieldTypeEnum.CHOICE || type === FieldTypeEnum.CHECKBOX) && (
        <>
          <div className="flex justify-between items-center mb-2">
            <Label>ตัวเลือก</Label>
            <FaPlus
              className="cursor-pointer"
              size={14}
              onClick={() => {
                const updatedFields = [...formFields];
                updatedFields[index].choices.push("");
                setFormFields(updatedFields);
              }}
            />
          </div>
          <DndContext
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={formFields[index].choices.map((_, i) => `choice-${i}`)}
            >
              {formFields[index].choices.map((choice, subindex) => (
                <DraggableChoice
                  key={subindex}
                  choice={choice}
                  index={index}
                  subindex={subindex}
                  formFields={formFields}
                  setFormFields={setFormFields}
                />
              ))}
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}
