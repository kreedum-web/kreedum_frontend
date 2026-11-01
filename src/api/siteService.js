import api from "./axios";
import API_ENDPOINTS from "./endpoints";

/** Content the owner manages: announcements, leaders, clients. */
const siteService = {
  getSiteContent() {
    return api.get(API_ENDPOINTS.SITE);
  },
};

export default siteService;
