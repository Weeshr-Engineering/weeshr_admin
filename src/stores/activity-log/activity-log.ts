import { defineStore } from 'pinia';
import axios from 'axios';

interface UserExtras {
  email: string;
  firstName: string;
  lastName: string;
}

interface User {
  id: string;
  type: string;
  extras: UserExtras;
}

interface Resource {
  ip: string;
  timestamp: number;
  user_agent: string;
}

interface ActivityLogItem {
  id: string;
  timestamp: string;
  user: User;
  action: string;
  resource: Resource;
  metadata: Record<string, unknown>;
  status: string;
  description: string;
}

 
interface ActivityLogState {
  logs: ActivityLogItem[];
  loading: boolean;
  error: string | null;
  filters: {
    log_action: [],
    log_status: [],
    log_user_types: [],
    sort_direction: ['asc', 'desc'],
  }
}

export const useActivityLogStore = defineStore('activityLog', {
  state: (): ActivityLogState => ({
    logs: [],
    loading: false,
    error: null,
    filters: {
      log_action: [],
      log_status: [],
      log_user_types: [],
      sort_direction: ['asc', 'desc'],
    }
  }),
  actions: {
    async fetchActivityLogs() {
      this.loading = true;
      this.error = null;

      const token = sessionStorage.getItem('token') || '';

      try {
        const response = await axios.get(
          'https://api.staging.weeshr.com/api/v1/admin/logs/activity-logs',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          this.logs = response.data.data.data;
        } else {
          this.error = response.data.message;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
      } finally {
        this.loading = false;
      }
    },

    async fetchFiltersAndMeta() {
      const token = sessionStorage.getItem('token') || '';

      try {
        const response = await axios.get(
          'https://api.staging.weeshr.com/api/v1/admin/logs/activity-logs/filters-and-meta',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data.data.filters;
        this.filters.log_action = data.log_action;
        this.filters.log_status = data.log_status;
        this.filters.log_user_types = data.log_user_types;
        } else {
          this.error = response.data.message;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
      }
    },
  },
});
