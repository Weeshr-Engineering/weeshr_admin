<template>
  <div class="flex-col flex bg-[#f0f8ff] h-full px-4 sm:px-10 pb-10">
    <MainNav class="mx-6" headingText="Activity Log" />

    <Card class="container px-4 pt-6 pb-10 mx-auto sm:px-6 lg:px-8 bg-[#FFFFFF] rounded-2xl mt-14 mb-4">
      <div class="flex flex-col gap-4 lg:flex-row items-center justify-between px-2 sm:px-6 py-4 w-full">
        <div class="text-xl sm:text-xl font-bold tracking-tight text-[#020721] mb-2 sm:mb-0">
          Activity Log
          <p class="text-xs sm:text-sm font-normal text-[#02072199]">
            List of Activity logs
          </p>
        </div>
        <div class="items-center grid grid-cols-3 md:grid-cols-3 gap-4 flex-row">
          <DropdownMenu>
            <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
              <Button variant="outline">
                <div class="flex items-center text-[10px] md:text-xs">
                  {{ selectedActionType || 'All Actions' }}
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="item-center justify-between max-h-80 overflow-y-auto">
              <DropdownMenuLabel class="item-center justify-center text-center">
                Select Action
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="selectedActionType">
                <DropdownMenuRadioItem value="" class="item-center text-center">
                  All Actions
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  v-for="action in actionTypes"
                  :key="action"
                  :value="action"
                  class="item-center text-center"
                >
                  {{ action }}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
              <Button variant="outline">
                <div class="flex items-center text-[10px] md:text-xs">
                  {{ selectedStatusType || 'All Status' }}
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="item-center justify-between max-h-60 overflow-y-auto">
              <DropdownMenuLabel class="item-center justify-center text-center">
                Select Status
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="selectedStatusType">
                <DropdownMenuRadioItem value="" class="item-center text-center">
                  All Status
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  v-for="status in statusTypes"
                  :key="status"
                  :value="status"
                  class="item-center text-center"
                >
                  {{ status }}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger as-child class="rounded-2xl bg-[#EEEFF5]">
              <Button variant="outline">
                <div class="flex items-center text-[10px] md:text-xs">
                  {{ selectedUserType || 'All Users' }}
                  <Icon icon="ion:chevron-down-outline" class="ml-1" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="item-center justify-between max-h-60 overflow-y-auto">
              <DropdownMenuLabel class="item-center justify-center text-center">
                Select User
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="selectedUserType">
                <DropdownMenuRadioItem value="" class="item-center text-center">
                  All Users
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  v-for="user in userTypes"
                  :key="user"
                  :value="user"
                  class="item-center text-center"
                >
                  {{ user }}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Search class="mt-3 lg:mt-0" />
      </div>

      <div class="overflow-auto bg-white rounded-lg shadow">
        <Table class="">
          <TableHeader>
            <TableRow class="text-[#02072199] font-semibold bg-gray-200">
              <TableHead class="text-sm">
                <div class="flex items-center cursor-pointer" @click="toggleSortOrder">
                  Timestamp
                  <Icon :icon="sortOrder === 'desc' ? 'fluent:chevron-down-20-regular' : 'fluent:chevron-up-20-regular'" class="ml-1" />
                </div>
              </TableHead>
              <TableHead class="text-left">User</TableHead>
              <TableHead class="text-left">Email</TableHead>
              <TableHead class="text-left">Action</TableHead>
              <TableHead class="text-left">Status</TableHead>
              <TableHead class="text-left">Description</TableHead>
              <TableHead></TableHead>  
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow
              v-for="log in paginatedLogs"
              :key="log.id"
             
            >
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ new Date(log.timestamp).toLocaleString() }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.user.extras.lastName + ' ' + log.user.extras.firstName }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.user.extras.email }}</TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs">{{ log.action }}</TableCell>
              <TableCell>
                <div :class="statusBg(log.status)" class="rounded-[10px] w-fit px-1.5 py-0.5 text-white text-xs capitalize">
                  {{ log.status }}
                </div>
              </TableCell>
              <TableCell class="text-xs md:text-sm lg:text-xs min-w-full">{{ log.description }}</TableCell>
              <TableCell @click="openModal(log)"><Icon icon="uil:angle-right" class="ml-1" width="25" height="25"
                  /> 
                
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <ModalComponent
      v-if="selectedLog"
      :action="selectedLog.action"
                    :resource="selectedLog.resource"
                    :metadata="selectedLog.metadata"
                    :show="isModalVisible"
                    @close="isModalVisible = false"
                    />
        
    <div class="flex gap-2 max-w-full flex-wrap justify-end mt-8 mr-4 items-center text-[15px]">
      <Pagination :total="totalPages" :sibling-count="1" show-edges :default-page="1" @change="handlePageChange">
        <PaginationList class="flex items-center gap-1">
            <PaginationFirst @click="handlePageChange(1)" />
            <PaginationPrev @click="handlePageChange(Math.max(currentPage - 1, 1))" />
            <template v-for="(item, index) in paginationItems" :key="index">
              <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
                <Button class="w-10 h-10 p-0" :variant="item.value === currentPage ? 'default' : 'outline'" @click="handlePageChange(item.value)">
                  {{ item.value }}
                </Button>
              </PaginationListItem>
            <PaginationEllipsis v-else :index="index" />
            </template>
            <PaginationNext @click="handlePageChange(Math.min(currentPage + 1, totalPages))" />
            <PaginationLast @click="handlePageChange(totalPages)" />
        </PaginationList>
      </Pagination>
        </div>
      
    </Card>

    
    <DashboardFooter />
    
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useActivityLogStore } from '@/stores/activity-log/activity-log';
import MainNav from '@/components/MainNav.vue';
import DashboardFooter from '@/components/DashboardFooter.vue';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModalComponent from '@/components/ModalComponent.vue';
import { Icon } from '@iconify/vue';
import {
  Table,
  TableRow,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination';

import Search from '@/components/UseSearch.vue';

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

const route = useRoute();
const store = useActivityLogStore();

const logs = ref<ActivityLogItem[]>(store.logs);
const loading = ref(store.loading);
const error = ref(store.error);

const perPage = 10;
const currentPage = ref(1);

const totalLogs = computed(() => filteredLogs.value.length);
const totalPages = computed(() => Math.ceil(totalLogs.value / perPage));

const sortOrder = ref<'asc' | 'desc'>('desc');
const selectedActionType = ref('');
const selectedStatusType = ref('');
const selectedUserType = ref('');

const sortedLogs = computed(() => {
  return [...logs.value].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB;
  });
});


const filteredLogs = computed(() => {
  return sortedLogs.value.filter((log) => {
    const actionMatch = !selectedActionType.value || log.action === selectedActionType.value;
    const statusMatch = !selectedStatusType.value || log.status === selectedStatusType.value;
    const userTypeMatch = !selectedUserType.value || log.user.type === selectedUserType.value;
    return actionMatch && statusMatch && userTypeMatch;
  });
});


const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return filteredLogs.value.slice(start, end);
});

const paginationItems = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push({ type: 'page', value: i });
  }
  return pages;
});

onMounted(() => {
  store.fetchActivityLogs();
  store.fetchFiltersAndMeta();
});

watch(
  () => store.logs,
  (newLogs) => {
    logs.value = newLogs;
  }
);

watch(
  () => store.loading,
  (newLoading) => {
    loading.value = newLoading;
  }
);

watch(
  () => store.error,
  (newError) => {
    error.value = newError;
  }
);

const statusBg = (status: string) => {
  switch (status) {
    case 'ERROR':
    case 'FAILED':
      return 'bg-[#E45044]';
    case 'SUCCESS':
      return 'bg-[#00c37f]';
    default:
      return '';
  }
};

const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    currentPage.value = newPage;
  }
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
};

const selectedLog = ref<ActivityLogItem | null>(null);
const isModalVisible = ref(false);

const openModal = (log: ActivityLogItem) => {
  selectedLog.value = log;
  isModalVisible.value = true;
};
const actionTypes = computed<string[]>(() => store.filters.log_action);
const statusTypes = computed<string[]>(() => store.filters.log_status);
const userTypes = computed<string[]>(() => store.filters.log_user_types);
</script>


