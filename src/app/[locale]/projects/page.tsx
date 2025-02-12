import {
  ProjectsShowcase
} from "@/components/sections/home";

export default async function ProjectsPage({ params }: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  return (
    <>
      <ProjectsShowcase/>
    </>
  );
}
