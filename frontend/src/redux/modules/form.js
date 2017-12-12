import { reducer as formReducer } from 'redux-form';
import { COMMENT_ADDING } from 'redux/modules/comments';

const form = formReducer.plugin({
  commentNew: (state, action) => {
    switch (action.type) {
      case COMMENT_ADDING.SUCCESS:
        return undefined; // Reset form
      default:
        return state;
    }
  }
});

export default form;
