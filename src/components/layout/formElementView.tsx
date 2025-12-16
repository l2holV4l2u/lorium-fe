import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormField } from "@lorium/prisma-zod";
import { FieldTypeEnum } from "@type/enum";
import { fieldTypeNameMap } from "@lib/utils/const";

interface SubComponentProps {
  index: number;
  formFields: FormField[];
}

function SECTION({ index, formFields }: SubComponentProps) {
  return (
    <div className="text-sm text-gray-600">
      {formFields[index].description || "คำบรรยาย"}
    </div>
  );
}

function SHORT_TEXT({ index, formFields }: SubComponentProps) {
  return (
    <Input
      placeholder={
        formFields[index].placeholder || fieldTypeNameMap["SHORT_TEXT"]
      }
      disabled
    />
  );
}

function LONG_TEXT({ index, formFields }: SubComponentProps) {
  return (
    <Textarea
      placeholder={
        formFields[index].placeholder || fieldTypeNameMap["LONG_TEXT"]
      }
      disabled
    />
  );
}

function CHOICE({ index, formFields }: SubComponentProps) {
  return (
    <>
      {formFields[index].choices.map((choice, subindex) => (
        <div
          key={subindex}
          className="flex items-center gap-2 text-sm font-normal text-gray-600"
        >
          <div className="w-4 h-4 border-2 rounded-full border-gray-400" />
          <div>{choice || `ตัวเลือก ${subindex + 1}`}</div>
        </div>
      ))}
    </>
  );
}

function CHECKBOX({ index, formFields }: SubComponentProps) {
  return (
    <>
      {formFields[index].choices.map((option, subindex) => (
        <div className="flex items-center gap-2" key={subindex}>
          <div className="w-4 h-4 border-2 rounded-sm border-gray-400 flex items-center justify-center" />
          <div className="text-sm font-normal text-gray-600">
            {option || `ตัวเลือก ${subindex + 1}`}
          </div>
        </div>
      ))}
    </>
  );
}

function DATE({ index, formFields }: SubComponentProps) {
  return (
    <Button variant="outline" disabled className="w-full justify-start">
      เลือกวันที่
    </Button>
  );
}

function FILE({ index, formFields }: SubComponentProps) {
  return (
    <div className="flex flex-col gap-2">
      <Input type="file" accept="image/*" disabled />
    </div>
  );
}

const formComponentMap = {
  SECTION,
  SHORT_TEXT,
  LONG_TEXT,
  CHOICE,
  CHECKBOX,
  DATE,
  FILE,
};

export function FormElementView({
  type,
  index,
  formFields,
}: {
  type: keyof typeof formComponentMap;
  index: number;
  formFields: FormField[];
}) {
  const Element = formComponentMap[type];

  return (
    <div className="flex relative w-full items-center justify-center gap-4">
      <div className="w-full flex flex-col gap-2">
        <div
          className={cn(
            "flex break-all max-w-full gap-1 font-semibold text-gray-800",
            type === FieldTypeEnum.SECTION && "text-xl"
          )}
        >
          {formFields[index].header || (type == "SECTION" ? "หัวข้อ" : "คำถาม")}
          {formFields[index].required && (
            <span className="text-red-800">*</span>
          )}
        </div>
        <Element index={index} formFields={formFields} />
      </div>
    </div>
  );
}
