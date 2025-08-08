import { IDashboardNavData } from "@/types/ILayout"
import List from "@mui/material/List";
import { SidebarItem } from "./SidebarItem";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import Collapse from "@mui/material/Collapse";

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

type Props = {
  data: IDashboardNavData[number];
  miniSidebar?: boolean;
}

export function SidebarItems({ data, miniSidebar = false }: Props) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  const isHasActiveChild = useMemo(() => data.items.some(d => d.path ? pathname.startsWith(d.path) : false),[pathname, data.items])

  const [collapse, setCollapse] = useState(!isHasActiveChild);

  const renderItems = (renderAsChild = false) => (
    data.items.map((item, j) => (
      <SidebarItem
        key={`${data.subheader?.title}-${item.title}-${j}`}
        text={item.title}
        icon={item.icon}
        href={item.path}
        miniSidebar={miniSidebar}
        active={item.path ? isActive(item.path) : false}
        depth={renderAsChild ? 2 : undefined}
      />
    ))
  );

  if(!data.subheader) {
    return renderItems();
  }
  return (
    <>
      <SidebarItem
        text={data.subheader.title}
        icon={data.subheader.icon}
        miniSidebar={miniSidebar}
        active={isHasActiveChild}
        onClick={() => setCollapse(old => !old)}
        append={!collapse ? <ExpandLess /> : <ExpandMore />}
      />
      <Collapse in={!collapse} timeout="auto">
        <List disablePadding>
          {renderItems(true)}
        </List>
      </Collapse>
    </>
  );
}