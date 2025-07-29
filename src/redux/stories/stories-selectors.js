export const getStoriesList = ({ stories }) => stories.stories;
export const getAllStories = ({ stories }) => stories.allStories;
export const getTotalPagesStories = ({ stories }) => stories.totalPagesStories;
export const getCurrentPageStories = ({ stories }) => stories.currentPageStories;
export const getModalWindowStatus = ({ stories }) =>
  stories.modalWindowStatus;
export const getStoriesError = ({ stories }) => stories.error;
export const getStoriesMessage = ({ stories }) => stories.message;
export const getLoadingStories = ({ stories }) => stories.loading;
export const getEditStory = ({ stories }) => stories.editStory;
export const getCurrentStory = ({ stories }) => stories.currentStory;

