import React from 'react';
import { connect } from 'react-redux';
import { Box, Textarea, Button } from '@chakra-ui/react';
import { userSelector } from '../selectors';

class WriteCommentBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      body: '',
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    alert('submit comment');
  };

  render() {
    const { body } = this.state;
    const { type = 'comment', user } = this.props;
    return (
      <Box>
        <form onSubmit={this.handleSubmit}>
          <Textarea
            value={body}
            onChange={(e) =>
              this.setState({
                body: e.target.value,
              })
            }
            variant="filled"
            isDisabled={!user}
            placeholder="what are your thoughts?"
            rows={5}
          />
          <Button type="submit">{type}</Button>
        </form>
      </Box>
    );
  }
}

const mapStateToProps = (state) => ({
  user: userSelector(state),
});

export default connect(mapStateToProps)(WriteCommentBox);
