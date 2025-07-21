export const getStoriesList = ({ stories }) => stories.stories;
export const getTotalPages = ({ stories }) => stories.totalPages;
export const getCurrentPage = ({ stories }) => stories.currentPage;
export const getModalWindowStatus = ({ stories }) =>
  stories.modalWindowStatus;
export const getStoriesError = ({ stories }) => stories.error;
export const getStoriesMessage = ({ stories }) => stories.message;
export const getLoadingStories = ({ stories }) => stories.loading;
export const getEditStory = ({ stories }) => stories.editStory;

