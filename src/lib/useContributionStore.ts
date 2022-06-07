import create from 'zustand';

interface ContribStore {
  isOpen: boolean;
  contentToEdit: string | null
  toggleModal: () => void;
  selectedBlock: number;
  contributionId: number | null,
  // eslint-disable-next-line no-unused-vars
  toggleEdit: (body:{content: string, blockId: number, contributionId: number}) => void
}


export const useContributionStore = create<ContribStore>()(set => ({
  isOpen: false,
  contentToEdit: null,
  selectedBlock: 0,
  contributionId: null,
  toggleModal: () => set(state => ({ isOpen: !state.isOpen })),
  toggleEdit: ({content, blockId, contributionId }) => set(state => ({isOpen: !state.isOpen, contentToEdit: content, selectedBlock: blockId, contributionId:contributionId }))
}));