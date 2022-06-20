import { useContributionStore } from '@lib/useContributionStore';
import { contributionSchema } from '@lib/formValidations';
import { useContributions } from '@lib/useContributions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import React from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Modal,
  ModalContent,
  ModalOverlay,
  Textarea,
  VStack,
} from '@chakra-ui/react';

export const ContributionModal = ({
  onClose,
  hasPost,
  post_uuid,
  post_id,
}: {
  hasPost: boolean;
  onClose: () => void;
  post_uuid: string;
  post_id: number;
}) => {
  const { isOpen, contentToEdit, selectedContributionId, selectedBlock } =
    useContributionStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contributionSchema) });

  const { createContrib, updateContrib } = useContributions(post_uuid);

  const { mutate: createMutation, isLoading: createContribLoading } =
    createContrib({
      onSuccesFunc: () => handleCloseModel(),
    });

  const { mutate: updateMutation, isLoading: updateContribLoading } =
    updateContrib({
      onSuccessFunc: () => handleCloseModel(),
    });

  const handleAddContribution = handleSubmit(async data => {
    if (hasPost) {
      createMutation({
        blockId: selectedBlock,
        postId: post_id,
        content: data.content,
      });
    }
  });

  const handleEditContribution = handleSubmit(async data => {
    if (hasPost && selectedContributionId) {
      updateMutation({
        id: selectedContributionId,
        content: data.content,
      });
    }
  });

  const handleCloseModel = () => {
    reset();
    onClose();
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent px={8} py={6}>
        <form
          name="create-contribution"
          onSubmit={
            contentToEdit ? handleEditContribution : handleAddContribution
          }
          style={{ width: '100%' }}
        >
          <VStack w="full" spacing={4} align="flex-start">
            <FormControl isInvalid={errors.content}>
              <FormLabel>Contribution</FormLabel>
              <Textarea
                id="content-textarea"
                h="36"
                defaultValue={contentToEdit ? contentToEdit : ''}
                {...register('content')}
              />
              <FormErrorMessage>
                {errors.content && errors.content.message}
              </FormErrorMessage>
            </FormControl>
            <HStack w="full" justify="space-between">
              <Button
                type="reset"
                onClick={handleCloseModel}
                id="content-submit-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                id="content-submit-button"
                isLoading={createContribLoading || updateContribLoading}
                colorScheme="blue"
              >
                Submit
              </Button>
            </HStack>
          </VStack>
        </form>
      </ModalContent>
    </Modal>
  );
};
