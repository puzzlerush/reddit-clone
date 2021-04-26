import React from 'react';
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  RadioGroup,
  Radio,
} from '@chakra-ui/react';

class CreatePostPage extends React.Component {
  render() {
    return (
      <Box w={['100%', '90%', '80%', '70%']} m="auto">
        <form>
          <FormControl>
            <Stack spacing={3}>
              <RadioGroup defaultValue="text">
                <Stack direction="row" spacing={3}>
                  <Radio value="text">text post</Radio>
                  <Radio value="link">link</Radio>
                </Stack>
              </RadioGroup>
              <Input variant="filled" placeholder="title" required />
              <Textarea
                variant="filled"
                placeholder="text (optional)"
                rows={10}
              />
            </Stack>
          </FormControl>
        </form>
      </Box>
    );
  }
}

export default CreatePostPage;
