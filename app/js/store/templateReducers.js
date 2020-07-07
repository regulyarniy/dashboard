export default {
  startLoad(state) {
    state.isLoading = true;
  },
  successLoadItems(state, action) {
    const { offset, count, items } = action.payload;
    return { ...state, offset, count, items, isLoading: false };
  },
  stopLoad(state) {
    state.isLoading = false;
  },
  startLoadById(state, action) {
    const { id } = action.payload;
    state.loadingIds.push(id);
  },
  stopLoadById(state, action) {
    const { id } = action.payload;
    state.loadingIds = state.loadingIds.filter(i => i !== id);
  },
  setStateForTests(state, { payload = {} }) {
    return { ...state, ...payload };
  }
};
