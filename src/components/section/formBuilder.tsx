"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { v4 as uuid } from "uuid";
import { FormEditor } from "./formRender";
import FormSidebar from "./formSidebar";
import { FormField } from "@lorium/prisma-zod";

export function FormBuilder({
  formFields,
  setFormFields,
}: {
  formFields: FormField[];
  setFormFields: (formFields: FormField[]) => void;
}) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [focus, setFocus] = useState<number | null>(null);
  const [activeID, setActiveID] = useState<string | null>(null);
  const [isOver, setIsOver] = useState<boolean>(false);

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (over?.id === "FormElementDropArea") {
      setIsOver(true);
    } else {
      setIsOver(false);
    }

    if (over && active.id !== over.id) {
      const activeIndex = formFields.findIndex((item) => item.id === active.id);
      const overIndex = formFields.findIndex((item) => item.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        setFormFields(arrayMove([...formFields], activeIndex, overIndex));
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over?.id === "FormElementDropArea") {
      const type = active.data.current?.type || String(active.id);
      setFormFields([
        ...formFields,
        {
          id: uuid(),
          type,
          fieldOrder: formFields.length + 1,
          header: "",
          choices: [""],
        } as FormField,
      ]);
    }

    setIsOver(false);
  }

  return (
    <DndContext
      onDragStart={(e) => {
        setActiveID(e.active.id as string);
        setIsDragging(true);
      }}
      onDragOver={handleDragOver}
      onDragEnd={(e) => {
        setIsDragging(false);
        setActiveID(null);
        handleDragEnd(e);
      }}
    >
      <div className="grid grid-cols-10 gap-2 w-full h-full">
        <div className="col-span-7 flex flex-col min-h-0">
          <SortableContext items={formFields.map((item) => item.id)}>
            <FormEditor
              formFields={formFields}
              setFormFields={setFormFields}
              isOver={isOver}
              setFocus={setFocus}
            />
          </SortableContext>
        </div>
        <FormSidebar
          isDragging={isDragging}
          activeID={activeID}
          focus={focus}
          setFocus={setFocus}
          formFields={formFields}
          setFormFields={setFormFields}
        />
      </div>
    </DndContext>
  );
}
