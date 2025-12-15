"use client";

import { DragOverlay, useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LucideAlignCenter,
  LucideCalendar,
  LucideLayoutTemplate,
  LucideList,
  LucideSquareCheckBig,
  LucideText,
  LucideUpload,
} from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { FieldTypes } from "@lib/utils/const";
import ElementProperty from "@components/layout/elementProperty";
import { FormField } from "@type";

const iconProps = { size: 24, strokeWidth: 2, color: "black" };
const iconMap: Record<string, JSX.Element> = {
  section: <LucideLayoutTemplate {...iconProps} />,
  shortanswer: <LucideText {...iconProps} />,
  longanswer: <LucideAlignCenter {...iconProps} />,
  multiplechoice: <LucideList {...iconProps} />,
  checkbox: <LucideSquareCheckBig {...iconProps} />,
  fileupload: <LucideUpload {...iconProps} />,
  datefield: <LucideCalendar {...iconProps} />,
};

function DraggableElement({ childTitle }: { childTitle: string }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: childTitle,
  });
  return (
    <Card
      className="flex flex-col items-center gap-2 p-2 h-full text-sm cursor-grab active:cursor-grabbing"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {iconMap[childTitle.toLowerCase().replace(/\s+/g, "")]}
      {childTitle}
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
  const [activeTab, setActiveTab] = useState<"element" | "property">("element");

  useEffect(() => {
    if (focus != null) setActiveTab("property");
  }, [focus]);

  return (
    <Card className="flex flex-col w-full h-full col-span-4 p-4 gap-4 overflow-auto">
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "element" | "property")}
      >
        <TabsList className="w-full">
          <TabsTrigger value="element">องค์ประกอบ</TabsTrigger>
          <TabsTrigger value="property">คุณสมบัติ</TabsTrigger>
        </TabsList>
        <TabsContent value="element">
          <div className="w-full grid grid-cols-2 col-span-2 gap-2">
            {FieldTypes.map((type) => (
              <DraggableElement childTitle={type} key={type} />
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
          <DraggableElement key={activeID} childTitle={activeID} />
        )}
      </DragOverlay>
    </Card>
  );
}
