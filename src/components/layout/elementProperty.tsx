import { Input } from "@components/ui/input";
import { DndContext, DragOverEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { CSS } from "@dnd-kit/utilities";
import { RiDraggable } from "react-icons/ri";
import { FormField } from "@zod";
import { nonInputFields } from "@lib/utils/const";
import { Toggle } from "@components/custom/toggle";

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
      className="flex items-center w-full gap-2"
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
        placeholder={
          `${
            formFields[index].type == "Multiple Choice" ? "Choice" : "Option"
          } ` +
          (subindex + 1)
        }
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

  function InputProp(field: string) {
    return {
      data: (formFields[index] as any)[field.toLowerCase()] || "",
      setData: updateData(field.toLowerCase()),
      label: field,
      placeholder: field,
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
    <>
      {!nonInputFields.includes(type) && <Toggle {...InputProp("Required")} />}
      <Input {...InputProp("Header")} />
      {type == "Section" ? (
        <Input {...InputProp("Description")} />
      ) : type == "Short Answer" || type == "Long Answer" ? (
        <Input {...InputProp("Placeholder")} />
      ) : (
        (type === "Multiple Choice" || type === "Checkbox") && (
          <>
            <div className="flex justify-between">
              <div className="font-semibold text-gray-800">
                {type == "Multiple Choice" ? "Choices" : "Options"}
              </div>
              <FaPlus
                className="cursor-pointer"
                size={14}
                onClick={() => {
                  var updatedFields = [...formFields];
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
        )
      )}
    </>
  );
}
