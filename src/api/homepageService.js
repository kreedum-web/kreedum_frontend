import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const homepageService = {
  getHomepageData() {
    return api.get(API_ENDPOINTS.HOMEPAGE);
  },
};

export default homepageService;