import { Flex, Text } from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';

const UpvoteBar = ({ size = 6, numVotes }) => {
  return (
    <Flex direction="column" alignItems="center" mr={3}>
      <TriangleUpIcon w={size} h={size} />
      <Text fontSize={3.5*size}>
        {numVotes}
      </Text>
      <TriangleDownIcon w={size} h={size} />
    </Flex>
  );
}

export default UpvoteBar;