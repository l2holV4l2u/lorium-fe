import { FormBuilder } from "@components/section/formBuilder";
import { FormViewer } from "@components/section/formRender";
import { FormField } from "@lorium/prisma-zod";
import { Edit, Eye, Save, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { useState } from "react";
import { trpc } from "@lib/trpc";
import { toast } from "sonner";

export function Form({
  formId,
  formFields,
  setFormFields,
}: {
  formId: string;
  formFields: FormField[];
  setFormFields: (formFields: FormField[]) => void;
}) {
  const [tab, setTab] = useState<"view" | "edit">("view");
  const [tempForm, setTempForm] = useState(formFields);
  const updateFormMutation = trpc.form.updateForm.useMutation();

  const onCancel = () => {
    setTempForm(formFields);
    setTab("view");
  };

  const onSave = async () => {
    try {
      console.log(tempForm);

      await updateFormMutation.mutateAsync({
        formId,
        formFieldsData: tempForm,
      });

      setFormFields(tempForm);
      setTab("view");
      toast.success("บันทึกสำเร็จ");
    } catch (error) {
      console.error("Failed to update form:", error);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as "view" | "edit")}
      className="h-full flex flex-col"
    >
      <div className="bg-white flex items-center justify-between mb-1">
        <h2 className="text-xl font-semibold">แบบฟอร์ม</h2>
        <TabsList>
          <TabsTrigger value="view" className="flex items-center gap-2 w-32">
            <Eye size={16} />
            ดูตัวอย่าง
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2 w-32">
            <Edit size={16} />
            แก้ไข
          </TabsTrigger>
        </TabsList>
        {tab === "edit" && (
          <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={onCancel}>
              <X size={16} /> ยกเลิก
            </Button>
            <Button size="sm" onClick={onSave}>
              <Save size={16} /> บันทึก
            </Button>
          </div>
        )}
        {tab === "view" && <div className="w-40" />}
      </div>

      <Separator orientation="horizontal" className="mb-2" />

      <div className="flex-1 overflow-hidden">
        <TabsContent value="edit" className="h-full m-0">
          <FormBuilder formFields={tempForm} setFormFields={setTempForm} />
        </TabsContent>
        <TabsContent value="view" className="h-full m-0">
          <FormViewer formFields={formFields} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
