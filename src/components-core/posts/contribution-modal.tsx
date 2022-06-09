import { useContributionStore } from '@lib/useContributionStore';
import { contributionSchema } from '@lib/formValidations';
import { contributionMutations } from '@lib/mutations';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
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
  block_id,
}: {
  hasPost: boolean;
  onClose: () => void;
  post_uuid: string;
  post_id: number;
  block_id: number;
}) => {
  const { isOpen, contentToEdit, selectedContributionId } =
    useContributionStore();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm({ resolver: yupResolver(contributionSchema) });

  const { mutate } = useSWRConfig();

  const handleAddContribution = handleSubmit(async data => {
    if (hasPost) {
      const { contribution, error: serverErrors } =
        await contributionMutations().create({
          postId: post_id,
          blockId: block_id,
          content: data.content,
        });
      if (contribution) {
        mutate(`/posts/${post_uuid}`);
        onClose();
      }
      // validation form the server
      if (serverErrors && serverErrors.hasOwnProperty('inner')) {
        serverErrors.inner.forEach((er: { path: string; message: string }) => {
          setError(er.path, { message: er.message });
        });
      }
    }
  });

  const handleEditContribution = handleSubmit(async data => {
    if (hasPost) {
      const { updatedContribution, error: serverErrorsEdit } =
        await contributionMutations().edit({
          contributionId: selectedContributionId,
          content: data.content,
        });

      if (updatedContribution) {
        mutate(`/blocks/${block_id}`);
        handleCloseModel();
      }
      // validation form the server
      if (serverErrorsEdit && serverErrorsEdit.hasOwnProperty('inner')) {
        serverErrorsEdit.inner.forEach(
          (er: { path: string; message: string }) => {
            setError(er.path, { message: er.message });
          },
        );
      }
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
                isLoading={isSubmitting}
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
