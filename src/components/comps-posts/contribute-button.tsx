import { Button } from '@chakra-ui/react';
import { IoMdAdd } from 'react-icons/io';

export const ContributeButton = ({
  message,
  handleClick,
}: {
  message: string;
  handleClick?: () => void;
}) => {
  return (
    <Button
      as="button"
      w="full"
      border="1px solid"
      bg="gray.50"
      borderColor="gray.200"
      leftIcon={<IoMdAdd />}
      onClick={handleClick ? handleClick : () => {}}
    >
      {message}
    </Button>
  );
};
