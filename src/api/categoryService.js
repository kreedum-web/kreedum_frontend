import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const categoryService = {
  getDepartments() {
    return api.get(API_ENDPOINTS.CATEGORIES);
  },

  getParentCategories(departmentSlug) {
    return api.get(`${API_ENDPOINTS.CATEGORIES}/${departmentSlug}`);
  },

  getChildCategories(parentSlug) {
    return api.get(`${API_ENDPOINTS.CATEGORIES}/${parentSlug}/children`);
  },
};

export default categoryService;