"use client";

import { DragOverlay, useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fieldTypeNameMap, iconMap } from "@lib/utils/const";
import ElementProperty from "@components/layout/elementProperty";
import { FormField } from "@lorium/prisma-zod";
import { FieldTypeEnum } from "@type/enum";

function DraggableElement({ title }: { title: string }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: title,
  });
  return (
    <Card
      className="flex flex-col items-center gap-2 p-2 h-full text-sm cursor-grab active:cursor-grabbing"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {iconMap[title]} {fieldTypeNameMap[title]}
    </Card>
  );
}

export default function FormSidebar({
  isDragging,
  activeID,
  focus,
  setFocus,
  formFields,
  setFormFields,
}: {
  isDragging: boolean;
  activeID: string | null;
  focus: number | null;
  setFocus: (focus: number | null) => void;
  formFields: FormField[];
  setFormFields: (fields: FormField[]) => void;
}) {
  return (
    <Card className="flex flex-col w-full h-full col-span-3 p-4 gap-4 overflow-auto">
      <Tabs defaultValue="element">
        <TabsList className="w-full">
          <TabsTrigger value="element">คำถาม</TabsTrigger>
          <TabsTrigger value="property">รายละเอียด</TabsTrigger>
        </TabsList>
        <TabsContent value="element">
          <div className="w-full grid grid-cols-2 col-span-2 gap-2">
            {Object.values(FieldTypeEnum).map((type) => (
              <DraggableElement title={type} key={type} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="property">
          <div className="flex flex-col gap-2">
            {focus != null && (
              <ElementProperty
                index={focus}
                setFocus={setFocus}
                formFields={formFields}
                setFormFields={setFormFields}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
      <DragOverlay>
        {isDragging && activeID && (
          <DraggableElement key={activeID} title={activeID} />
        )}
      </DragOverlay>
    </Card>
  );
}
