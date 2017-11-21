import { reducer as formReducer } from 'redux-form';
const COMMENT_ADD = `COMMENT_ADD`;

const form = formReducer.plugin({
  commentNew: (state, action) => {
    switch (action.type) {
      case COMMENT_ADD:
        return undefined; // Reset form
      default:
        return state;
    }
  }
});

export default form;
