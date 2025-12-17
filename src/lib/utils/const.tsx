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

export const THAI_MONTH_SHORT: Record<number, string> = {
  0: "ม.ค.",
  1: "ก.พ.",
  2: "มี.ค.",
  3: "เม.ย.",
  4: "พ.ค.",
  5: "มิ.ย.",
  6: "ก.ค.",
  7: "ส.ค.",
  8: "ก.ย.",
  9: "ต.ค.",
  10: "พ.ย.",
  11: "ธ.ค.",
};
