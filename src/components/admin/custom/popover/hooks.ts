import React, { useState } from "react";

export function usePopover<E extends HTMLElement>() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);

  const handleOpen = (event: React.MouseEvent<E>) => {
    setAnchorEl(event.currentTarget)
  }

  return {
    anchorEl,
    setAnchorEl,
    open: Boolean(anchorEl),
    onOpen: handleOpen,
    onClose: () => setAnchorEl(null),
  }
}