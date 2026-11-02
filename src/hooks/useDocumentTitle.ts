import { useEffect } from "react";

const siteName = "Local Bakery Co.";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${siteName}`;
  }, [title]);
}
