import create from 'zustand';

interface ContribStore {
  isOpen: boolean;
  contentToEdit: string | null
  // eslint-disable-next-line no-unused-vars
  toggleModalOpen: (selectedBlock?: number, selectedPost?: number | null) => void;
  toggleModalClosed: () => void;
  selectedBlock: number;
  selectedPost: number | null;
  selectedContributionId: number | null;
  // eslint-disable-next-line no-unused-vars
  toggleEdit: (body:{content: string, blockId: number, selectedContributionId: number}) => void
}


export const useContributionStore = create<ContribStore>()(set => ({
  isOpen: false,
  contentToEdit: null,
  selectedBlock: 0,
  selectedPost: null,
  selectedContributionId: null,
  toggleModalOpen: (selectedBlock, selectedPost = null) => set(() => ({ isOpen: true, selectedBlock: selectedBlock ?? 0, selectedPost: selectedPost})),
  toggleModalClosed: () => set(() => ({ isOpen: false, contentToEdit: null, selectedBlock: 0, selectedContributionId: null})),
  toggleEdit: ({content, blockId, selectedContributionId }) => set(state => ({isOpen: !state.isOpen, contentToEdit: content, selectedBlock: blockId, selectedContributionId:selectedContributionId }))
}));