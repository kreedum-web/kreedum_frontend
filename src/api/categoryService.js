import api from "./axios";
import API_ENDPOINTS from "./endpoints";

const categoryService = {
  /** Full menu tree: departments → categories → sub-categories, with product counts. */
  getCategoryTree() {
    return api.get(API_ENDPOINTS.CATEGORIES);
  },

  /** One category with its breadcrumb and product count. */
  getCategory(slug) {
    return api.get(`${API_ENDPOINTS.CATEGORIES}/${slug}`);
  },
};

export default categoryService;
