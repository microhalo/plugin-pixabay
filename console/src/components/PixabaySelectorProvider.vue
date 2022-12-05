<script lang="ts" setup>
import {
  VCard,
  IconCheckboxFill,
  VAvatar,
  VButton,
  IconExternalLinkLine,
  Toast,
} from "@halo-dev/components";
import { ref, watchEffect } from "vue";

import axios from 'axios'

import type { AttachmentLike } from "@halo-dev/console-shared";
import apiClient from "../utils/api-client";
import type { ConfigMap } from "../types";

withDefaults(
  defineProps<{
    selected: AttachmentLike[];
  }>(),
  {
    selected: () => [],
  }
);

const emit = defineEmits<{
  (event: "update:selected", attachments: AttachmentLike[]): void;
}>();

const accessKey = ref<string>("");

const photos = ref([]);
const page = ref(1);
const loading = ref(false);
const selectedPhotos = ref<Set<any>>(new Set());
const keyword = ref("");

const handleFetchPixabayAccessKey = async () => {
  try {
    const { data: configMap } = await apiClient.get<ConfigMap>(
      "/api/v1alpha1/configmaps/pixabay-settings"
    );

    accessKey.value = JSON.parse(
      configMap.data?.basic || "{ accessKey: '' }"
    ).accessKey;
  } catch (error) {
    console.error("Failed to fetch plugin-pixabay configMap", error);
    Toast.warning("未正确配置 Pixabay 的 Access Key");
  }
};

const handleFetchPhotos = async () => {
  loading.value = true;
  const  { data:dataResponse } =await axios.request({method: 'GET', url: `https://pixabay.com/api/?key=${accessKey.value}&q=${keyword.value}&per_page=48&page=${page.value}`})
  if (dataResponse.hits) {
    photos.value = [...photos.value, ...dataResponse.hits];
  }
  loading.value = false;
};

const handleSearch = async (data?: any) => {
  if (!keyword.value) {
    page.value = 1;
    photos.value = [];
  }

  if (data) {
    keyword.value = data.keyword;
  }

  if (!data.keyword) {
    photos.value = [];
    page.value = 1;
    return;
  }

  loading.value = true;
  
  const  { data:dataResponse } =await axios.request({method: 'GET', url: `https://pixabay.com/api/?key=${accessKey.value}&q=${keyword.value}&per_page=48&page=${page.value}`})

  if (dataResponse.hits) {
    photos.value = [...photos.value, ...dataResponse.hits];
  }

  loading.value = false;
};

const handleFetchNext = () => {
  page.value++;

  if (keyword.value) {
    handleSearch();
    return;
  }else{
    handleFetchPhotos();
  }

};

const handleSelect = async (photo) => {
  if (selectedPhotos.value.has(photo)) {
    selectedPhotos.value.delete(photo);
    return;
  }
  selectedPhotos.value.add(photo);
};

const isChecked = (photo) => {
  return Array.from(selectedPhotos.value)
    .map((item) => item.id)
    .includes(photo.id);
};

watchEffect(() => {
  const photos = Array.from(selectedPhotos.value).map((photo) => {
    return {
      url: photo.largeImageURL,
      type: photo.tags as string,
    };
  });
  emit("update:selected", photos);
});

await handleFetchPixabayAccessKey();
</script>
<template>
  <div>
    <FormKit id="search-form" type="form" @submit="handleSearch">
      <FormKit
        name="keyword"
        type="text"
        placeholder="输入关键字搜索"
        @keyup.enter="$formkit.submit('search-form')"
      ></FormKit>
    </FormKit>
  </div>

  <div
    class="pixabay-mt-2 pixabay-grid pixabay-grid-cols-3 pixabay-gap-x-2 pixabay-gap-y-3 sm:pixabay-grid-cols-3 md:pixabay-grid-cols-6"
    role="list"
  >
    <VCard
      v-for="(photo, index) in photos"
      :key="index"
      :body-class="['!pixabay-p-0']"
      :class="{
        'pixabay-ring-1 pixabay-ring-black': isChecked(photo),
      }"
      class="hover:pixabay-shadow"
      @click.stop="handleSelect(photo)"
    >
      <div class="pixabay-group pixabay-relative pixabay-bg-white">
        <div
          class="pixabay-aspect-w-10 pixabay-aspect-h-8 pixabay-block pixabay-h-full pixabay-w-full pixabay-cursor-pointer pixabay-overflow-hidden pixabay-bg-gray-100"
        >
          <img
            class="pixabay-pointer-events-none pixabay-object-cover group-hover:pixabay-opacity-75"
            :src="photo.previewURL"
          />
        </div>
        <div
          :class="{ '!pixabay-flex': selectedPhotos.has(photo) }"
          class="pixabay-absolute pixabay-top-0 pixabay-left-0 pixabay-hidden pixabay-h-1/3 pixabay-w-full pixabay-justify-between pixabay-bg-gradient-to-b pixabay-from-gray-300 pixabay-to-transparent pixabay-ease-in-out group-hover:pixabay-flex"
        >
          <a
            :href="photo.pageURL"
            target="_blank"
            class="pixabay-mt-1 pixabay-ml-1"
          >
            <IconExternalLinkLine
              class="pixabay-h-6 pixabay-w-6 pixabay-cursor-pointer pixabay-text-white pixabay-transition-all hover:pixabay-text-black"
            />
          </a>
          <IconCheckboxFill
            :class="{
              '!pixabay-text-black': selectedPhotos.has(photo),
            }"
            class="pixabay-mt-1 pixabay-mr-1 pixabay-h-6 pixabay-w-6 pixabay-cursor-pointer pixabay-text-white pixabay-transition-all hover:pixabay-text-black"
          />
        </div>
        <div
          :class="{ '!pixabay-flex': selectedPhotos.has(photo) }"
          class="pixabay-absolute pixabay-left-0 pixabay-bottom-0 pixabay-hidden pixabay-w-full pixabay-bg-gradient-to-t pixabay-from-gray-600 pixabay-to-transparent pixabay-ease-in-out group-hover:pixabay-flex"
        >
          <div
            class="p-1 pixabay-flex pixabay-w-full pixabay-flex-row pixabay-items-center pixabay-gap-2"
          >
            <VAvatar
              v-if="photo.userImageURL"
              :src="photo.userImageURL"
              circle
              size="sm"
            ></VAvatar>
            <div
              class="flex pixabay-flex-1 pixabay-flex-col pixabay-truncate"
            >
              <a
                class="pixabay-truncate pixabay-text-xs pixabay-font-medium pixabay-text-white hover:pixabay-underline"
                :href="photo.pageURL"
                target="_blank"
              >
                {{ photo.user }}
              </a>
              <span
                class="pixabay-truncate pixabay-text-xs pixabay-text-white pixabay-opacity-80"
              >
                {{ photo.tags }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </VCard>
  </div>
  <div
    class="pixabay-mt-4 pixabay-flex pixabay-items-center pixabay-justify-center"
  >
    <VButton :loading="loading" type="secondary" @click="handleFetchNext">
      {{ loading ? "加载中..." : "加载更多" }}
    </VButton>
  </div>
</template>
<style scoped>
.pixabay-topics::-webkit-scrollbar-track-piece {
  background-color: #f8f8f8;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

.pixabay-topics::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.pixabay-topics::-webkit-scrollbar-thumb {
  background-color: #f2eaea;
  background-clip: padding-box;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

.pixabay-topics::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}
</style>
