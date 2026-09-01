import { ref, computed, reactive } from 'vue';

// ── Types ─────────────────────────────────────────────────────────────────

export interface Block {
  id: string;
  page_id: string;
  type: string;
  content: Record<string, any>;
  styles: Record<string, any>;
  sort_order: number;
  updated_at?: number;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  description: string;
  is_home: number;
  is_published: number;
  sort_order: number;
  block_count?: number;
  revision_count?: number;
  blocks?: Block[];
}

export interface Revision {
  id: string;
  page_id: string;
  action: string;
  snapshot: { blocks: Block[] };
  block_count: number;
  created_at: number;
  created_by_email?: string;
}

// Block type definitions — what shows in the block library
export const BLOCK_TYPES = [
  { type: 'hero', label: 'Hero', icon: '◈', description: 'Full-width hero with tagline' },
  { type: 'text', label: 'Text', icon: '¶', description: 'Rich text paragraph' },
  { type: 'image', label: 'Image', icon: '▣', description: 'Single image with caption' },
  { type: 'works-grid', label: 'Works Grid', icon: '⊞', description: 'Portfolio works grid' },
  { type: 'contact', label: 'Contact', icon: '✉', description: 'Contact section' },
  { type: 'spacer', label: 'Spacer', icon: '│', description: 'Vertical spacing' },
  { type: 'divider', label: 'Divider', icon: '―', description: 'Horizontal line' },
  { type: 'video', label: 'Video', icon: '▶', description: 'Video embed (YouTube/Vimeo)' },
  { type: 'gallery', label: 'Gallery', icon: '⊟', description: 'Image gallery grid' },
  { type: 'quote', label: 'Quote', icon: '❝', description: 'Pull quote / testimonial' },
] as const;

// Default content for each block type
export function getDefaultContent(type: string): Record<string, any> {
  switch (type) {
    case 'hero':
      return { tagline: 'Your tagline here', layout: 'centered', show_arrow: true };
    case 'text':
      return { text: 'Enter your text here...', align: 'left', size: 'medium' };
    case 'image':
      return { url: '', alt: '', caption: '', fit: 'cover' };
    case 'works-grid':
      return { columns: 3, category: 'all', show_count: 6 };
    case 'contact':
      return { email: '', phone: '', show_social: true };
    case 'spacer':
      return { height: '4rem' };
    case 'divider':
      return { style: 'solid', width: '100%' };
    case 'video':
      return { url: '', aspect_ratio: '16/9' };
    case 'gallery':
      return { columns: 3, images: [] };
    case 'quote':
      return { text: '', author: '', role: '' };
    default:
      return {};
  }
}

// ── Builder state ─────────────────────────────────────────────────────────

const currentPage = ref<Page | null>(null);
const blocks = ref<Block[]>([]);
const selectedBlockId = ref<string | null>(null);
const pages = ref<Page[]>([]);
const revisions = ref<Revision[]>([]);
const history = ref<Block[][]>([]); // Undo stack
const historyIndex = ref(-1);
const isSaving = ref(false);
const isDirty = ref(false);

export function useBuilder() {
  const selectedBlock = computed(() =>
    blocks.value.find((b) => b.id === selectedBlockId.value) || null,
  );

  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < history.value.length - 1);

  // Push current blocks state to history
  function pushHistory() {
    // Trim any redo states
    history.value = history.value.slice(0, historyIndex.value + 1);
    // Deep clone blocks
    history.value.push(JSON.parse(JSON.stringify(blocks.value)));
    historyIndex.value = history.value.length - 1;

    // Keep max 50 history states
    if (history.value.length > 50) {
      history.value.shift();
      historyIndex.value--;
    }
  }

  function undo() {
    if (!canUndo.value) return;
    historyIndex.value--;
    blocks.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]));
    isDirty.value = true;
  }

  function redo() {
    if (!canRedo.value) return;
    historyIndex.value++;
    blocks.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]));
    isDirty.value = true;
  }

  // Load a page with its blocks
  async function loadPage(pageId: string) {
    const data = await $fetch<{ blocks: Block[] } & Page>(`/api/pages/${pageId}`);
    currentPage.value = data;
    blocks.value = data.blocks || [];
    selectedBlockId.value = null;
    isDirty.value = false;
    history.value = [JSON.parse(JSON.stringify(blocks.value))];
    historyIndex.value = 0;
    await loadRevisions(pageId);
  }

  // Load all pages
  async function loadPages() {
    pages.value = await $fetch<Page[]>('/api/pages');
    return pages.value;
  }

  // Load revisions for current page
  async function loadRevisions(pageId: string) {
    revisions.value = await $fetch<Revision[]>('/api/history', {
      query: { page_id: pageId },
    });
    return revisions.value;
  }

  // Add a new block
  function addBlock(type: string, index?: number) {
    pushHistory();
    const newBlock: Block = {
      id: `temp_${Date.now()}`,
      page_id: currentPage.value?.id || '',
      type,
      content: getDefaultContent(type),
      styles: {},
      sort_order: index !== undefined ? index : blocks.value.length,
    };

    if (index !== undefined) {
      blocks.value.splice(index, 0, newBlock);
      reorderBlocks();
    } else {
      blocks.value.push(newBlock);
    }

    selectedBlockId.value = newBlock.id;
    isDirty.value = true;
  }

  // Remove a block
  function removeBlock(blockId: string) {
    pushHistory();
    const index = blocks.value.findIndex((b) => b.id === blockId);
    if (index !== -1) {
      blocks.value.splice(index, 1);
      reorderBlocks();
    }
    if (selectedBlockId.value === blockId) {
      selectedBlockId.value = null;
    }
    isDirty.value = true;
  }

  // Duplicate a block
  function duplicateBlock(blockId: string) {
    const block = blocks.value.find((b) => b.id === blockId);
    if (!block) return;

    pushHistory();
    const index = blocks.value.findIndex((b) => b.id === blockId);
    const newBlock: Block = {
      ...JSON.parse(JSON.stringify(block)),
      id: `temp_${Date.now()}`,
      sort_order: index + 1,
    };
    blocks.value.splice(index + 1, 0, newBlock);
    reorderBlocks();
    selectedBlockId.value = newBlock.id;
    isDirty.value = true;
  }

  // Move block (drag and drop)
  function moveBlock(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    pushHistory();
    const [block] = blocks.value.splice(fromIndex, 1);
    blocks.value.splice(toIndex, 0, block);
    reorderBlocks();
    isDirty.value = true;
  }

  // Update block content
  function updateBlockContent(blockId: string, content: Record<string, any>) {
    const block = blocks.value.find((b) => b.id === blockId);
    if (block) {
      block.content = { ...block.content, ...content };
      isDirty.value = true;
    }
  }

  // Update block styles
  function updateBlockStyles(blockId: string, styles: Record<string, any>) {
    const block = blocks.value.find((b) => b.id === blockId);
    if (block) {
      block.styles = { ...block.styles, ...styles };
      isDirty.value = true;
    }
  }

  // Reorder sort_order based on array position
  function reorderBlocks() {
    blocks.value.forEach((block, index) => {
      block.sort_order = index;
    });
  }

  // Save all blocks to server
  async function saveAll() {
    if (!currentPage.value) return;
    isSaving.value = true;

    try {
      // Delete blocks that were removed (have temp_ prefix but no longer exist)
      const originalIds = new Set(
        (currentPage.value.blocks || []).map((b) => b.id),
      );
      const currentIds = new Set(blocks.value.map((b) => b.id));

      // Delete removed blocks
      for (const id of originalIds) {
        if (!currentIds.has(id) && !id.startsWith('temp_')) {
          await $fetch(`/api/blocks/${id}`, { method: 'DELETE' });
        }
      }

      // Create or update blocks
      for (let i = 0; i < blocks.value.length; i++) {
        const block = blocks.value[i];
        if (block.id.startsWith('temp_')) {
          // Create new block
          await $fetch('/api/blocks', {
            method: 'POST',
            body: {
              page_id: currentPage.value.id,
              type: block.type,
              content: block.content,
              styles: block.styles,
            },
          });
        } else {
          // Update existing
          await $fetch(`/api/blocks/${block.id}`, {
            method: 'PATCH',
            body: {
              content: block.content,
              styles: block.styles,
              sort_order: i,
            },
          });
        }
      }

      // Reorder
      await $fetch('/api/blocks/reorder', {
        method: 'POST',
        body: {
          page_id: currentPage.value.id,
          block_ids: blocks.value.map((b) => b.id.replace('temp_', '')),
        },
      });

      isDirty.value = false;
      // Reload to get proper IDs
      await loadPage(currentPage.value.id);
    } finally {
      isSaving.value = false;
    }
  }

  // Restore a revision
  async function restoreRevision(revisionId: string) {
    const result = await $fetch<{ blocks: Block[] }>('/api/history/restore', {
      method: 'POST',
      body: { revision_id: revisionId },
    });
    blocks.value = result.blocks;
    pushHistory();
    isDirty.value = true;
  }

  // Create a new page
  async function createPage(data: { slug: string; title: string; description?: string }) {
    const result = await $fetch<{ id: string }>('/api/pages', {
      method: 'POST',
      body: data,
    });
    await loadPages();
    return result;
  }

  // Delete a page
  async function deletePage(pageId: string) {
    await $fetch(`/api/pages/${pageId}`, { method: 'DELETE' });
    await loadPages();
  }

  return {
    // State
    currentPage,
    blocks,
    selectedBlockId,
    selectedBlock,
    pages,
    revisions,
    isSaving,
    isDirty,
    canUndo,
    canRedo,
    // Methods
    loadPage,
    loadPages,
    loadRevisions,
    addBlock,
    removeBlock,
    duplicateBlock,
    moveBlock,
    updateBlockContent,
    updateBlockStyles,
    saveAll,
    restoreRevision,
    createPage,
    deletePage,
    undo,
    redo,
    pushHistory,
  };
}
