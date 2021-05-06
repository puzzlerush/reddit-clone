import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import {
  Link,
  Code,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

const ChakraMarkdown = ({ children }) => (
  <ReactMarkdown
    remarkPlugins={[gfm]}
    components={{
      a: (props) => <Link color="blue.400" {...props} />,
      blockquote: (props) => <Code p={1} {...props} />,
      code: (props) => <Code p={1} {...props} />,
      em: (props) => <Text as="em" {...props} />,
      h1: (props) => <Heading as="h1" size="2xl" {...props} />,
      h2: (props) => <Heading as="h2" size="xl" {...props} />,
      h3: (props) => <Heading as="h3" size="lg" {...props} />,
      h4: (props) => <Heading as="h4" size="md" {...props} />,
      h5: (props) => <Heading as="h5" size="sm" {...props} />,
      h6: (props) => <Heading as="h6" size="xs" {...props} />,
      p: (props) => <Text as="p" my={3} {...props} />,
      table: Table,
      tbody: Tbody,
      td: Td,
      th: Th,
      thead: Thead,
      tr: Tr,
    }}
  >
    {children}
  </ReactMarkdown>
);

export default ChakraMarkdown;
