import { JSX } from "react";
import {
  LucideAlignCenter,
  LucideCalendar,
  LucideLayoutTemplate,
  LucideList,
  LucideSquareCheckBig,
  LucideText,
  LucideUpload,
} from "lucide-react";

export const nonInputFields = ["Section"];

export const iconProps = { size: 24, strokeWidth: 2, color: "black" };
export const iconMap: Record<string, JSX.Element> = {
  SECTION: <LucideLayoutTemplate {...iconProps} />,
  SHORT_TEXT: <LucideText {...iconProps} />,
  LONG_TEXT: <LucideAlignCenter {...iconProps} />,
  CHOICE: <LucideList {...iconProps} />,
  CHECKBOX: <LucideSquareCheckBig {...iconProps} />,
  FILE: <LucideUpload {...iconProps} />,
  DATE: <LucideCalendar {...iconProps} />,
};
export const fieldTypeNameMap: Record<string, string> = {
  SECTION: "หัวข้อ",
  SHORT_TEXT: "คำตอบสั้น",
  LONG_TEXT: "คำตอบยาว",
  CHOICE: "ตัวเลือก",
  CHECKBOX: "กล่องเลือก",
  FILE: "ไฟล์",
  DATE: "วันที่",
};
