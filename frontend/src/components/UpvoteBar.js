import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Flex, Text, IconButton } from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { submitVote } from '../actions';

const UpvoteBar = ({
  type = 'post',
  size = 6,
  numVotes,
  id,
  voteValue,
  submitVote,
}) => {
  const upvoteColor = 'orange.500';
  const downvoteColor = 'blue.500';

  const numberColor =
    voteValue === 1 ? upvoteColor : voteValue === -1 ? downvoteColor : null;

  const upvoteIcon = (
    <TriangleUpIcon
      color={voteValue === 1 ? upvoteColor : null}
      w={size}
      h={size}
      _hover={{ color: upvoteColor }}
    />
  );

  const downvoteIcon = (
    <TriangleDownIcon
      w={size}
      h={size}
      _groupHover={{ color: downvoteColor }}
    />
  );

  const handleUpvote = () => {
    const voteDetails = { type, id };
    if (voteValue === 1) {
      voteDetails.voteValue = 0;
      voteDetails.newNumVotes = numVotes - 1;
    } else if (voteValue === 0 || voteValue === null) {
      voteDetails.voteValue = 1;
      voteDetails.newNumVotes = numVotes + 1;
    } else if (voteValue === -1) {
      voteDetails.voteValue = 1;
      voteDetails.newNumVotes = numVotes + 2;
    }
    submitVote(voteDetails);
  };

  const handleDownvote = () => {
    const voteDetails = { type, id };
    if (voteValue === 1) {
      voteDetails.voteValue = -1;
      voteDetails.newNumVotes = numVotes - 2;
    } else if (voteValue === 0 || voteValue === null) {
      voteDetails.voteValue = -1;
      voteDetails.newNumVotes = numVotes - 1;
    } else if (voteValue === -1) {
      voteDetails.voteValue = 0;
      voteDetails.newNumVotes = numVotes + 1;
    }
    submitVote(voteDetails);
  };

  return (
    <Flex direction="column" alignItems="center" mr={3}>
      <IconButton
        role="group"
        onClick={handleUpvote}
        backgroundColor="inherit"
        color={voteValue === 1 ? upvoteColor : null}
        boxShadow="none !important"
        icon={upvoteIcon}
      />
      <Text fontSize={3.5 * size} color={numberColor}>
        {numVotes}
      </Text>
      <IconButton
        role="group"
        onClick={handleDownvote}
        backgroundColor="inherit"
        color={voteValue === -1 ? downvoteColor : null}
        boxShadow="none !important"
        icon={downvoteIcon}
      />
    </Flex>
  );
};

UpvoteBar.propTypes = {
  size: PropTypes.number,
  numVotes: PropTypes.number,
  type: PropTypes.oneOf(['post', 'comment']),
  id: PropTypes.number,
  voteValue: PropTypes.oneOf([-1, 0, 1, null]),
  submitVote: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  submitVote: (type, id, voteValue, newNumVotes) =>
    dispatch(submitVote(type, id, voteValue, newNumVotes)),
});

export default connect(undefined, mapDispatchToProps)(UpvoteBar);
