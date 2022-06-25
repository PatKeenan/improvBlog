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
      colorScheme="telegram"
      variant="outline"
      leftIcon={<IoMdAdd />}
      onClick={handleClick ? handleClick : () => {}}
    >
      {message}
    </Button>
  );
};
