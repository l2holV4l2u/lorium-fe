import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField } from "@type";
import { cn } from "@/lib/utils";

interface SubComponentProps {
  index: number;
  formFields: FormField[];
}

export function MultipleChoice({ index, formFields }: SubComponentProps) {
  return (
    <>
      {formFields[index].choices.map((choice, subindex) => (
        <div
          key={subindex}
          className="flex items-center gap-2 text-sm font-normal text-gray-600"
        >
          <div className="w-4 h-4 border-2 rounded-full border-gray-400" />
          <div>{choice || `Choice ${subindex + 1}`}</div>
        </div>
      ))}
    </>
  );
}

function Checkbox({ index, formFields }: SubComponentProps) {
  return (
    <>
      {formFields[index].choices.map((option, subindex) => (
        <div className="flex items-center gap-2" key={subindex}>
          <div className="w-5 h-5 border-2 rounded-md border-gray-400 flex items-center justify-center" />
          <div className="text-sm font-normal text-gray-600">
            {option || `Option ${subindex + 1}`}
          </div>
        </div>
      ))}
    </>
  );
}

function DateField() {
  return (
    <Button variant="outline" disabled className="w-full justify-start">
      เลือกวันที่
    </Button>
  );
}

function FileUpload() {
  return (
    <div className="flex flex-col gap-2">
      <Input type="file" accept="image/*" disabled />
    </div>
  );
}

export function LongAnswer({ index, formFields }: SubComponentProps) {
  return (
    <Textarea
      placeholder={formFields[index].placeholder || "Long Answer"}
      disabled
    />
  );
}

export function ShortAnswer({ index, formFields }: SubComponentProps) {
  return (
    <Input
      placeholder={formFields[index].placeholder || "Short Answer"}
      disabled
    />
  );
}

export function Section({ index, formFields }: SubComponentProps) {
  return (
    <div className="text-sm text-gray-600">
      {formFields[index].description || "Section Description"}
    </div>
  );
}

const formComponentMap = {
  Section,
  MultipleChoice,
  Checkbox,
  FileUpload,
  DateField,
  ShortAnswer,
  LongAnswer,
};

export function FormElementView({
  type,
  index,
  formFields,
}: {
  type: string;
  index: number;
  formFields: FormField[];
}) {
  const key = type.replace(/ /g, "") as keyof typeof formComponentMap;
  const Element = formComponentMap[key];

  return (
    <div className="flex relative w-full items-center justify-center gap-4">
      <div className="w-full flex flex-col gap-2">
        <div
          className={cn(
            "flex break-all max-w-full gap-1 font-semibold text-gray-800",
            type === "Section" && "text-xl"
          )}
        >
          {formFields[index].header || "Header"}
          {formFields[index].required && (
            <span className="text-red-800">*</span>
          )}
        </div>
        <Element index={index} formFields={formFields} />
      </div>
    </div>
  );
}
