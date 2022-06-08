import create from 'zustand';

interface ContribStore {
  isOpen: boolean;
  contentToEdit: string | null
  toggleModalOpen: () => void;
  toggleModalClosed: () => void;
  selectedBlock: number;
  contributionId: number | null;
  // eslint-disable-next-line no-unused-vars
  toggleEdit: (body:{content: string, blockId: number, contributionId: number}) => void
}


export const useContributionStore = create<ContribStore>()(set => ({
  isOpen: false,
  contentToEdit: null,
  selectedBlock: 0,
  contributionId: null,
  toggleModalOpen: () => set(() => ({ isOpen: true})),
  toggleModalClosed: () => set(() => ({ isOpen: false, contentToEdit: '', selectedBlock: 0, contributionId: null})),
  toggleEdit: ({content, blockId, contributionId }) => set(state => ({isOpen: !state.isOpen, contentToEdit: content, selectedBlock: blockId, contributionId:contributionId }))
}));