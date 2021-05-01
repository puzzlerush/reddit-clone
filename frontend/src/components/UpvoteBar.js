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

  return (
    <Flex direction="column" alignItems="center" mr={3}>
      <IconButton
        role="group"
        onClick={
          voteValue === 1
            ? () =>
                submitVote({
                  type,
                  id,
                  voteValue: 0,
                  newNumVotes: numVotes - 1,
                })
            : () =>
                submitVote({
                  type,
                  id,
                  voteValue: 1,
                  newNumVotes: numVotes + 1,
                })
        }
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
        onClick={
          voteValue === -1
            ? () =>
                submitVote({
                  type,
                  id,
                  voteValue: 0,
                  newNumVotes: numVotes + 1,
                })
            : () =>
                submitVote({
                  type,
                  id,
                  voteValue: -1,
                  newNumVotes: numVotes - 1,
                })
        }
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
  voteValue: PropTypes.number,
  submitVote: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  submitVote: (type, id, voteValue, newNumVotes) =>
    dispatch(submitVote(type, id, voteValue, newNumVotes)),
});

export default connect(undefined, mapDispatchToProps)(UpvoteBar);
