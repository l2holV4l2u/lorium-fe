import { FormElementView } from "@components/layout/formElementView";
import { Card } from "@components/ui/card";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField } from "@lorium/prisma-zod";
import { GripVertical, Trash2 } from "lucide-react";

// Sortable Form Element for Editor mode
const SortableFormElement = ({
  field,
  index,
  formFields,
  setFocus,
  onDelete,
  showDivider,
}: {
  field: FormField;
  index: number;
  formFields: FormField[];
  setFocus: (focus: number) => void;
  onDelete: (id: string) => void;
  showDivider: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: isDragging ? "relative" : undefined,
    zIndex: isDragging ? 999 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {showDivider && (
        <div className="w-full border-t border-dashed border-gray-300 my-4" />
      )}
      <div
        className="bg-white border-2 border-transparent hover:border-blue-400 rounded-lg px-2 py-4 cursor-pointer transition-colors"
        onClick={() => setFocus(index)}
      >
        <div className="flex items-center gap-4">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical size={20} className="text-gray-400" />
          </button>
          <div className="flex-1">
            <FormElementView
              type={field.type}
              index={index}
              formFields={formFields}
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(field.id);
            }}
            className="cursor-pointer p-2 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

// VIEWER MODE - Read-only display
export function FormViewer({ formFields }: { formFields: FormField[] }) {
  return (
    <div className="max-w-xl h-full justify-self-center w-full">
      <div className="bg-white overflow-auto p-4 h-full">
        <div className="flex flex-col justify-center">
          {formFields.map((field, index) => (
            <div key={field.id}>
              {index !== 0 && formFields.length > index && (
                <div className="w-full border-dashed border px-4 my-4" />
              )}
              <FormElementView
                type={field.type}
                index={index}
                formFields={formFields}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// EDITOR MODE - With drag-and-drop and editing
export function FormEditor({
  formFields,
  setFormFields,
  isOver,
  setFocus,
}: {
  formFields: FormField[];
  setFormFields: (fields: FormField[]) => void;
  isOver: boolean;
  setFocus: (focus: number) => void;
}) {
  const { setNodeRef } = useDroppable({ id: "FormElementDropArea" });

  const handleDelete = (id: string) => {
    setFormFields(formFields.filter((field) => field.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = formFields.findIndex((item) => item.id === active.id);
      const overIndex = formFields.findIndex((item) => item.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        setFormFields(arrayMove(formFields, activeIndex, overIndex));
      }
    }
  };

  return (
    // Card fills full height and uses flex-col layout for scrolling inside
    <Card ref={setNodeRef} className="flex flex-col p-4 h-full overflow-hidden">
      <DndContext
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={formFields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col overflow-auto flex-1">
            {formFields.map((field, index) => (
              <SortableFormElement
                key={field.id}
                field={field}
                index={index}
                formFields={formFields}
                setFocus={setFocus}
                onDelete={handleDelete}
                showDivider={index !== 0 && formFields.length > index}
              />
            ))}
            {isOver && (
              <div className="p-4">
                <div className="w-full h-16 bg-blue-100 border-blue-400 rounded-lg border-2 border-dashed flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    วางที่นี่เพื่อเพิ่มฟิลด์
                  </span>
                </div>
              </div>
            )}

            {formFields.length === 0 && !isOver && (
              <div className="p-12 text-center border-2 border-dashed rounded-lg">
                <p className="text-gray-400">
                  ลากฟิลด์มาที่นี่เพื่อเริ่มสร้างแบบฟอร์ม
                </p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </Card>
  );
}

// RESPONSE MODE - For filling out the form
export function FormResponse({
  formFields,
  onSubmit,
}: {
  formFields: FormField[];
  onSubmit?: () => void;
}) {
  return (
    <div className="w-full h-full max-h-[75vh]">
      <div className="bg-white rounded-lg shadow-sm overflow-auto p-4 h-full">
        <div className="flex justify-center">
          <div className="flex flex-col w-full gap-4">
            {formFields.map((field, index) => (
              <div key={field.id}>
                {index !== 0 && formFields.length > index && (
                  <div className="w-full border-t border-gray-200 my-6" />
                )}
                <FormElementView
                  type={field.type}
                  index={index}
                  formFields={formFields}
                />
              </div>
            ))}

            {formFields.length > 0 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={onSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  ส่งแบบฟอร์ม
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
