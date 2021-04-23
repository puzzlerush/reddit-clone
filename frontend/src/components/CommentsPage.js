import { Text, Heading, Box, Flex, useColorMode } from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import ThemedBox from './ThemedBox';

const CommentsPage = () => {
  const { colorMode } = useColorMode();
  const postDetailColor = 'gray.400';
  const postDetailBgColor = colorMode === 'light' ? 'gray.100' : 'gray.600';
  return (
    <ThemedBox
      p={4}
      borderRadius="md"
      width="100%"
      light="gray.50"
      dark="gray.700"
    >
      <Text as="span" color={postDetailColor} fontWeight="bold">
        r/AskReddit
      </Text>
      {' '}
      <Text as="span" colorisTruncated>
        Posted by u/dalkerkd 16 hours ago
      </Text>
      <Heading mt={2} mb={4} fontSize="1.5em" fontWeight="500">
        What foods get better when you add rice? This also happens
        to be a very long title.
      </Heading>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Text>
      <Flex mt={3} alignItems="center" color={postDetailColor} fontWeight="bold">
        <Box p={2} borderRadius="sm" _hover={{ backgroundColor: postDetailBgColor }}>
          <ChatIcon mr={2} />
          12 comments
        </Box>
      </Flex>
    </ThemedBox>
  );
}

export default CommentsPage;