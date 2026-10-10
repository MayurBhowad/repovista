import { themeInitScript } from "@/components/layout/theme";

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}
