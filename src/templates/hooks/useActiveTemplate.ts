import { useEffect, useState } from "react";
import { getActiveTemplate, TemplateName } from "../registered"

type UseActiveTemplate = {
  templateName: TemplateName;
}

export function useActiveTemplate(): UseActiveTemplate {
  const [templateName, setTemplateName] = useState<TemplateName>('default');

  const loadTemplateName = async () => {
    try {
      const name = await getActiveTemplate();
      setTemplateName(name);
    } catch (error) {
      setTemplateName('default');
    }
  }
  useEffect(() => {
    loadTemplateName();
  }, []);

  return {
    templateName,
  };
}