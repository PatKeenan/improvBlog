import create from 'zustand';

interface ContribStore {
  isOpen: boolean;
  contentToEdit: string | null
  toggleModalOpen: () => void;
  toggleModalClosed: () => void;
  selectedBlock: number;
  selectedContributionId: number | null;
  // eslint-disable-next-line no-unused-vars
  toggleEdit: (body:{content: string, blockId: number, selectedContributionId: number}) => void
}


export const useContributionStore = create<ContribStore>()(set => ({
  isOpen: false,
  contentToEdit: null,
  selectedBlock: 0,
  selectedContributionId: null,
  toggleModalOpen: () => set(() => ({ isOpen: true})),
  toggleModalClosed: () => set(() => ({ isOpen: false, contentToEdit: null, selectedBlock: 0, selectedContributionId: null})),
  toggleEdit: ({content, blockId, selectedContributionId }) => set(state => ({isOpen: !state.isOpen, contentToEdit: content, selectedBlock: blockId, selectedContributionId:selectedContributionId }))
}));