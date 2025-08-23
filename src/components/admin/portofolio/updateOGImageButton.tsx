import { useProfileData, useUpdateProfileData } from "@/contexts/profileDataContext";
import { updateOGImage } from "@/db/repositories/RepoTemplates.server";
import { isDatePassed } from "@/lib/date";
import { getActiveTemplate } from "@/templates/registered";
import { generatePreviewWithCache } from "@/utils/imageGeneration.server";
import Button from "@mui/material/Button";
import { useMemo, useState } from "react";

export function UpdateOGImageButton() {
  const { lastUpdated, lastOGImgGenerated } = useProfileData();
  const updateProfileData = useUpdateProfileData();
  const [isLoading, setIsLoading] = useState(false);

  const isOGImageExpired = useMemo(() => !lastOGImgGenerated || isDatePassed(lastUpdated, lastOGImgGenerated), [lastUpdated, lastOGImgGenerated]);

  const updateOG = async () => {
    try {
      setIsLoading(true);
      const tmplName = await getActiveTemplate();
      const tmplViewUrl = `${window.location.protocol}//${window.location.host}/en/?tmpl=${tmplName}`;
      const buffer = await generatePreviewWithCache(tmplViewUrl, { removeElements: ['nextjs-portal'] });

      const blob = new Blob([buffer], { type: 'image/png' });
      // Create File from Blob
      const file = new File([blob], `og-image-${tmplName}.png`, {
        type: 'image/png',
        lastModified: Date.now(),
      });

      await updateOGImage(file);

      await updateProfileData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      onClick={updateOG}
      disabled={!isOGImageExpired}
      loading={isLoading}
    >Update OG Image</Button>
  );
}