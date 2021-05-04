import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Box,
  Stack,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  Select,
  Button,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  createLoadingAndErrorSelector,
  subredditsSelector,
} from '../selectors';
import { getSubreddits } from '../actions/subreddits';
import { submitPost } from '../actions/post';

class CreatePostPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postType: 'text',
      title: '',
      body: '',
      url: '',
      subreddit: '',
    };
  }

  componentDidMount() {
    const { getSubreddits } = this.props;
    getSubreddits();
  }

  handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { postType, title, body, url, subreddit } = this.state;
      const { submitPost, history } = this.props;
      const { id } = await submitPost({
        type: postType,
        title,
        body: postType === 'text' ? body : url,
        subreddit,
      });
      history.push(`/r/${subreddit}/comments/${id}`);
    } catch (err) {}
  };

  render() {
    const { postType, title, body, url, subreddit } = this.state;
    const {
      srIsLoading,
      srError,
      submitIsLoading,
      submitError,
      subreddits,
    } = this.props;
    return (
      <Box w={['100%', '90%', '80%', '70%']} m="auto">
        {submitError && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {submitError}
          </Alert>
        )}
        <form onSubmit={this.handleSubmit}>
          <Stack spacing={3}>
            <FormControl>
              <RadioGroup
                value={postType}
                onChange={(postType) => this.setState({ postType })}
              >
                <Stack direction="row" spacing={3}>
                  <Radio value="text">text post</Radio>
                  <Radio value="link">link</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl>
              <Input
                value={title}
                onChange={(e) => this.setState({ title: e.target.value })}
                type="text"
                variant="filled"
                placeholder="title"
                isRequired
              />
            </FormControl>
            <FormControl>
              {postType === 'text' ? (
                <Textarea
                  value={body}
                  onChange={(e) => this.setState({ body: e.target.value })}
                  variant="filled"
                  placeholder="text (optional)"
                  rows={10}
                />
              ) : (
                <Input
                  value={url}
                  onChange={(e) => this.setState({ url: e.target.value })}
                  type="url"
                  variant="filled"
                  placeholder="url"
                  required
                />
              )}
            </FormControl>
            <FormControl isInvalid={srError}>
              <Select
                value={subreddit}
                onChange={(e) => this.setState({ subreddit: e.target.value })}
                variant="filled"
                placeholder={srIsLoading ? 'loading...' : 'choose a subreddit'}
                isRequired
              >
                {subreddits.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>Could not load subreddits</FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              isLoading={srIsLoading || submitIsLoading || null}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
    );
  }
}

const {
  loadingSelector: srLoadingSelector,
  errorSelector: srErrorSelector,
} = createLoadingAndErrorSelector(['GET_SUBREDDITS']);

const {
  loadingSelector: submitLoadingSelector,
  errorSelector: submitErrorSelector,
} = createLoadingAndErrorSelector(['SUBMIT_POST'], false);

const mapStateToProps = (state) => ({
  srIsLoading: srLoadingSelector(state),
  srError: srErrorSelector(state),
  submitIsLoading: submitLoadingSelector(state),
  submitError: submitErrorSelector(state),
  subreddits: subredditsSelector(state),
});

const mapDispatchToProps = (dispatch) => ({
  getSubreddits: () => dispatch(getSubreddits()),
  submitPost: (postDetails) => dispatch(submitPost(postDetails)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreatePostPage)
);
