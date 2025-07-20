import { FilesUploadType, FileThumbnailProps, UploadProps } from "@/types/IFileUpload";
import { alpha, styled, SxProps, Theme } from "@mui/material/styles"
import React, { forwardRef, memo, useEffect, useMemo, useState } from "react";

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import CloseIcon from '@mui/icons-material/Close';

import type { Transform } from "@dnd-kit/utilities";
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DraggableSyntheticListeners,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors
} from "@dnd-kit/core";

import {
  AnimateLayoutChanges,
  arrayMove,
  arraySwap,
  defaultAnimateLayoutChanges,
  NewIndexGetter,
  rectSortingStrategy,
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import Portal from "@mui/material/Portal";
import { fileData, formatFilesize } from "@/lib/file";
import IconButton from "@mui/material/IconButton";
import { FileThumbnail } from "./FileThumbnail";
import ListItemText from "@mui/material/ListItemText";

type Props = React.ComponentProps<'ul'> & {
  sx?: SxProps<Theme>;
  files: FilesUploadType;
  lastNode?: React.ReactNode;
  firstNode?: React.ReactNode;
  onRemove: UploadProps['onRemove'];
  thumbnail: UploadProps['thumbnail'];

  /**
   * default to 'sort'
   */
  reorderType?: 'swap' | 'sort';
  onReordered?: (reordered_files: FilesUploadType) => void;
  slotProps?: {
    thumbnail?: Omit<FileThumbnailProps, 'file'>;
  };
}

type ItemType = { id: UniqueIdentifier; file: FilesUploadType[number] };

export function MultiFilePreview({
  sx,
  onRemove,
  firstNode,
  lastNode,
  thumbnail,
  slotProps,
  files = [],
  className,
  reorderType = 'sort',
  onReordered,
  ...rest
}: Props) {

  const items = useMemo<ItemType[]>(() => files.map((file, i) => ({
    id: `${typeof file === 'string' ? file : file.name}-${i}`,
    file,
  })),[files]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const [activeId, setActiveId] = useState<UniqueIdentifier|null>(null);
  const getIndex = (id: UniqueIdentifier) => items.findIndex((item) => id == item.id);

  const activeIndex = activeId != null ? getIndex(activeId) : -1;

  const strategy = reorderType == 'swap' ? rectSwappingStrategy : rectSortingStrategy;
  const reorderItems = reorderType == 'swap' ? arraySwap : arrayMove;

  const getNewIndex = reorderType == 'swap'
    ? ({
      id,
      items,
      activeIndex: currentIndex,
      overIndex,
    }: NewIndexGetter['arguments']) => reorderItems(items, currentIndex, overIndex).indexOf(id)
    : undefined;
  
  const renderDragOverlay = () => (
    <Portal>
      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.5" } } }),
      }}>
        {activeId != null ? (
          <ItemBase item={items[activeIndex]} stateProps={{ dragOverlay: true }} onRemove={() => {}} thumbnail={thumbnail} reorderable/>
        ) : null}
      </DragOverlay>
    </Portal>
  );

  return (
    <DndContext
      id="dnd-multifile-preview"
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onReordered ? ({ active }) =>{
        if(!active) return;

        setActiveId(active.id);
      } : undefined}
      onDragEnd={onReordered ? ({ over }) => {
        setActiveId(null);

        if(over){
          const overIndex = getIndex(over.id);
          if(activeIndex !== overIndex) {
            onReordered(reorderItems(files, activeIndex, overIndex));
          }
        }
      } : undefined}
    >
      <SortableContext items={items} strategy={strategy}>
        <ListRoot
          thumbnail={thumbnail}
          className={['MultiFilePreview',className].join(' ')}
          sx={sx}
          {...rest}
        >
          {firstNode && <ItemNode thumbnail={thumbnail}>{firstNode}</ItemNode>}

          {items.map((item, index) => !!onReordered ? (
            <ReorderableItem
              key={item.id}
              item={item}
              id={item.id}
              index={index}
              getNewIndex={getNewIndex}
              thumbnail={thumbnail}
              onRemove={() => onRemove?.(item.file)}
            />
          ) : (
            <ItemBase
              key={item.id}
              item={item}
              thumbnail={thumbnail}
              onRemove={() => onRemove?.(item.file)}
            />
          ))}

          {lastNode && <ItemNode thumbnail={thumbnail}>{lastNode}</ItemNode>}
        </ListRoot>
      </SortableContext>

      {renderDragOverlay()}
    </DndContext>
  );
}

// ========================================================================

const ListRoot = styled('ul', {
  shouldForwardProp: (prop: string) => !['thumbnail', 'sx'].includes(prop),
})<Pick<Props, 'thumbnail'>>(({ thumbnail, theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'column',
  padding: 0,
  ...(thumbnail && { flexWrap: 'wrap', flexDirection: 'row' }),
}));

const ItemNode = styled('li', {
  shouldForwardProp: (prop: string) => !['thumbnail', 'sx'].includes(prop),
})<Pick<Props, 'thumbnail'>>(({ thumbnail }) => ({
  ...(thumbnail && { width: 'auto', display: 'inline-flex' }),
}));

// ReorderableItem

const animateLayoutChanges: AnimateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true });

type ReorderableItemProps = {
  index: number;
  id: UniqueIdentifier;
  getNewIndex?: NewIndexGetter;
  onRemove?: () => void;
  item: ItemType;
  thumbnail?: boolean;
}

function ReorderableItem({ id, index, getNewIndex, item, onRemove, thumbnail = false }: ReorderableItemProps) {
  const {
    isSorting,
    transform,
    listeners,
    attributes,
    isDragging,
    setNodeRef,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id, getNewIndex, animateLayoutChanges });

  return (
    <ItemBase
      ref={setNodeRef}
      item={item}
      data-id={id}
      data-index={index}
      onRemove={onRemove}
      stateProps={{
        listeners,
        transform,
        transition,
        sorting: isSorting,
        dragging: isDragging,
        dragOverlay: isDragging,
        handleProps: { ref: setActivatorNodeRef },
      }}
      thumbnail={thumbnail}
      reorderable
      {...attributes}
    />
  );
}

// Items base

const itemClasses = {
  item: 'item',
  itemWrap: 'item_wrap',
  removeButton: 'remove_btn',
  state: {
    sorting: '--sorting',
    dragging: '--dragging',
    dragOverlay: '--drag-overlay',
  },
}

type ItemBaseProps = React.ComponentProps<'div'> & {
  sx?: SxProps<Theme>;
  item: ItemType;
  thumbnail?: boolean;
  onRemove?: () => void;
  reorderable?: boolean;
  stateProps?: {
    sorting?: boolean;
    dragging?: boolean;
    dragOverlay?: boolean;
    transition?: string | null;
    transform?: Transform | null;
    listeners?: DraggableSyntheticListeners;
    handleProps?: any;
  };
}
const _ItemBase = forwardRef<HTMLLIElement, ItemBaseProps>((props, ref) => {
  const { item, stateProps, sx, thumbnail, onRemove, reorderable = false, ...rest } = props;
  const { name, size } = fileData(item.file);

  useEffect(() => {
    if(!stateProps?.dragOverlay) {
      return;
    }

    document.body.style.cursor = 'grabbing';

    return () => {
      document.body.style.cursor = '';
    }
  },[stateProps?.dragOverlay]);

  return (
    <ItemWrap
      ref={ref}
      className={[
        itemClasses.itemWrap,
        stateProps?.sorting ? itemClasses.state.sorting : '',
        stateProps?.dragging ? itemClasses.state.dragging : '',
        stateProps?.dragOverlay ? itemClasses.state.dragOverlay : '',
      ].join(' ')}
      sx={[
        () => ({
          ...(!!stateProps?.transition && { transition: stateProps.transition }),
          ...(!!stateProps?.transform && {
            '--translate-x': `${Math.round(stateProps.transform.x)}px`,
            '--translate-y': `${Math.round(stateProps.transform.y)}px`,
            '--scale-x': `${stateProps.transform.scaleX}`,
            '--scale-y': `${stateProps.transform.scaleY}`,
          }),
        })
      ]}
    >
      <ItemRoot
        className={[
          itemClasses.item,
          stateProps?.sorting ? itemClasses.state.sorting : '',
          stateProps?.dragging ? itemClasses.state.dragging : '',
          stateProps?.dragOverlay ? itemClasses.state.dragOverlay : '',
        ].join(' ')}
        data-cypress="draggable-item"
        sx={[
          (theme) => ({
            border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
            ...(thumbnail ? {
              display: 'inline-flex',
              width: 100,
              height: 100,
            } : {
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing(1.5),
              padding: theme.spacing(1, 1, 1, 1.5),
            })
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...rest}
      >
        {reorderable && (
          <IconButton
            disableRipple
            disableFocusRipple
            disableTouchRipple
            {...stateProps?.handleProps}
            {...stateProps?.listeners}
            size="small"
            sx={thumbnail && [(theme) => ({
              position: 'absolute',
              top: 5, left: 5,
              zIndex: 1,
              backgroundColor: alpha(theme.palette.grey[800], 0.5),
              color: theme.palette.common.white,
              fontSize: 14,
            })]}
          >
            <DragIndicatorIcon fontSize="inherit"/>
          </IconButton>
        )}
        {thumbnail ? (
          <FileThumbnail
            tooltip
            imageView
            file={item.file}
            onRemove={onRemove}
            sx={{ width: '100%', height: '100%' }}
            slotProps={{
              icon: {
                sx: {
                  width: 36,
                  height: 36,
                }
              },
              removeButton: {
                className: itemClasses.removeButton,
                sx: {
                  position: 'absolute',
                  top: 5, right: 5,
                },
              },
            }}
          />
        ) : (
          <>
            <FileThumbnail file={item.file}/>

            <ListItemText
              primary={name}
              secondary={formatFilesize(size)}
              slotProps={{
                secondary: { component: 'span', typography: 'caption' },
              }}
            />

            {onRemove && (
              <IconButton
                disableRipple
                disableFocusRipple
                disableTouchRipple
                size="small"
                onClick={onRemove}
              >
                <CloseIcon/>
              </IconButton>
            )}
          </>
        )}
      </ItemRoot>
    </ItemWrap>
  );
});

const ItemBase = memo(_ItemBase);

// =========================================

const ItemWrap = styled('li')({
  flexShrink: 0,
  display: 'flex',
  transform: 'translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))',
  transformOrigin: '0 0',
  touchAction: 'manipulation',
  [`&.${itemClasses.state.dragOverlay}`]: { zIndex: 999 },
});

const ItemRoot = styled('div')(({ theme }) => ({
  width: '100%',
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  transformOrigin: '50% 50%',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['box-shadow']),
  color: alpha(theme.palette.text.disabled, 0.24),
  backgroundColor: alpha(theme.palette.grey[500], 0.04),
  border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[900],
  }),
  '&:hover': {
    [`& .${itemClasses.removeButton}`]: {
      opacity: 0.48,
    },
  },
  [`& .${itemClasses.removeButton}`]: {
    opacity: 0,
    transition: theme.transitions.create(['opacity']),
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    fontSize: 14,
    '&:hover': {
      backgroundColor: theme.palette.grey[900],
    }
  },
  [`&.${itemClasses.state.dragOverlay}`]: {
    backdropFilter: 'blur(6px)',
    boxShadow: theme.shadows[20],
    color: theme.palette.text.primary,
    backgroundColor: alpha(theme.palette.common.white, 0.48),
    ...theme.applyStyles('dark', {
      backgroundColor: alpha(theme.palette.grey[900], 0.48),
    }),
  },
  [`&.${itemClasses.state.dragging}`]: {
    opacity: 0.24,
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
  },
}));