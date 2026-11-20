<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { LogEntry } from '../types';
import { api } from '../api/client';

const props = withDefaults(
  defineProps<{
    active?: boolean;
  }>(),
  {
    active: true,
  },
);

const levelFilter = ref<string>('ALL');
const categoryFilter = ref<string>('ALL');
const searchKeyword = ref<string>('');
const autoRefresh = ref<boolean>(true);
const autoScroll = ref<boolean>(true);
const entries = ref<LogEntry[]>([]);
const latestId = ref<number>(0);
const loading = ref<boolean>(false);
const errorText = ref<string | null>(null);
const listRef = ref<HTMLDivElement | null>(null);

let pollTimer: number | null = null;
let searchDebounceTimer: number | null = null;

const levelOptions = ['ALL', 'INFO', 'WARN', 'ERROR'];
const categoryOptions = [
  'ALL',
  'SYSTEM',
  'SAFETY',
  'MOTION',
  'FIELDBUS',
  'COMPILER',
  'SCRIPT',
];

const statsSummary = computed(() => {
  let warn = 0;
  let err = 0;
  for (const item of entries.value) {
    if (item.level === 'WARN') warn++;
    else if (item.level === 'ERROR') err++;
  }
  return { total: entries.value.length, warn, err };
});

function formatTime(iso: string): string {
  const idx = iso.indexOf('T');
  if (idx === -1) return iso;
  return iso.slice(idx + 1, idx + 13);
}

async function refreshLogs(silent = false, incremental = false) {
  if (!silent) loading.value = true;
  errorText.value = null;
  try {
    const afterId = incremental && latestId.value > 0 ? latestId.value : undefined;
    const res = await api.fetchLogs({
      level: levelFilter.value,
      category: categoryFilter.value,
      q: searchKeyword.value,
      after_id: afterId,
      limit: 300,
    });
    if (incremental && afterId !== undefined) {
      if (res.entries.length > 0) {
        const merged = [...entries.value, ...res.entries];
        entries.value = merged.length > 300 ? merged.slice(merged.length - 300) : merged;
      }
      if (res.latest_id < latestId.value) {
        // 日志被清空后全量拉取一次
        entries.value = res.entries;
      }
    } else {
      entries.value = res.entries;
    }
    latestId.value = res.latest_id;
    if (autoScroll.value && (!incremental || res.entries.length > 0)) {
      await nextTick();
      if (listRef.value) {
        listRef.value.scrollTop = listRef.value.scrollHeight;
      }
    }
  } catch (err: any) {
    errorText.value = err?.message || '获取日志失败';
  } finally {
    loading.value = false;
  }
}

async function handleClear() {
  try {
    await api.clearLogs();
    latestId.value = 0;
    entries.value = [];
    await refreshLogs(false, false);
  } catch (err: any) {
    errorText.value = err?.message || '清空日志失败';
  }
}

async function handleExport(format: 'jsonl' | 'text') {
  try {
    const res = await api.exportLogs({
      level: levelFilter.value,
      category: categoryFilter.value,
      q: searchKeyword.value,
      format,
    });
    if (!res.ok) {
      errorText.value = res.error || '导出日志失败';
      return;
    }
    const blob = new Blob([res.content], {
      type: res.contentType || 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download =
      res.filename || `bass-logs.${format === 'text' ? 'txt' : 'jsonl'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err: any) {
    errorText.value = err?.message || '导出日志失败';
  }
}

watch([levelFilter, categoryFilter], () => {
  latestId.value = 0;
  refreshLogs(false, false);
});

watch(searchKeyword, () => {
  if (searchDebounceTimer !== null) {
    clearTimeout(searchDebounceTimer);
  }
  searchDebounceTimer = window.setTimeout(() => {
    latestId.value = 0;
    refreshLogs(true, false);
  }, 300);
});

watch(
  () => props.active,
  (isActive) => {
    if (isActive) {
      refreshLogs(true, latestId.value > 0);
    }
  },
);

onMounted(() => {
  refreshLogs(false, false);
  pollTimer = window.setInterval(() => {
    if (props.active && autoRefresh.value) {
      refreshLogs(true, latestId.value > 0);
    }
  }, 1200);
});

onBeforeUnmount(() => {
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  if (searchDebounceTimer !== null) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = null;
  }
});
</script>

<template>
  <div class="log-panel-container">
    <!-- 顶部过滤与操作工具栏 -->
    <div class="log-toolbar">
      <div class="filter-group">
        <select v-model="levelFilter" class="filter-select" title="日志级别过滤">
          <option v-for="lvl in levelOptions" :key="lvl" :value="lvl">
            {{ lvl === 'ALL' ? '全部级别' : lvl }}
          </option>
        </select>

        <select v-model="categoryFilter" class="filter-select" title="日志模块分类">
          <option v-for="cat in categoryOptions" :key="cat" :value="cat">
            {{ cat === 'ALL' ? '全部分类' : cat }}
          </option>
        </select>

        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索关键字..."
          @keyup.enter="refreshLogs()"
        />
        <button type="button" class="tool-btn" @click="refreshLogs()">
          {{ loading ? '加载...' : '🔍 查询' }}
        </button>
      </div>

      <div class="action-group">
        <label class="toggle-check">
          <input v-model="autoRefresh" type="checkbox" />
          <span>自动刷新</span>
        </label>
        <label class="toggle-check">
          <input v-model="autoScroll" type="checkbox" />
          <span>滚到底部</span>
        </label>
        <button type="button" class="tool-btn export-btn" @click="handleExport('jsonl')">
          ⬇ JSONL
        </button>
        <button type="button" class="tool-btn export-btn" @click="handleExport('text')">
          ⬇ TXT
        </button>
        <button type="button" class="tool-btn clear-btn" @click="handleClear">
          🗑 清空
        </button>
      </div>
    </div>

    <!-- 摘要信息栏 -->
    <div class="log-stats-bar">
      <span>显示 {{ statsSummary.total }} 条记录 (最新 ID #{{ latestId }})</span>
      <div class="stats-pills">
        <span class="stat-pill warn">WARN: {{ statsSummary.warn }}</span>
        <span class="stat-pill error">ERROR: {{ statsSummary.err }}</span>
      </div>
    </div>

    <div v-if="errorText" class="log-error-banner">⚠ {{ errorText }}</div>

    <!-- 日志列表主体 -->
    <div ref="listRef" class="log-list">
      <div v-if="entries.length === 0" class="empty-hint">暂无匹配的结构化日志记录</div>
      <div
        v-for="item in entries"
        :key="item.id"
        class="log-row"
        :class="item.level.toLowerCase()"
      >
        <span class="col-id">#{{ item.id }}</span>
        <span class="col-time" :title="item.timestamp_iso">{{ formatTime(item.timestamp_iso) }}</span>
        <span class="col-level" :class="item.level.toLowerCase()">{{ item.level }}</span>
        <span class="col-cat">{{ item.category }}</span>
        <span class="col-src">{{ item.source }}</span>
        <span class="col-msg">{{ item.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-panel-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #0b1120;
  color: #e2e8f0;
  overflow: hidden;
  box-sizing: border-box;
}

.log-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  background: #131c31;
  border-bottom: 1px solid #1e293b;
}

.filter-group,
.action-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-select,
.search-input {
  background: #0b1120;
  border: 1px solid #334155;
  color: #f1f5f9;
  font-size: 0.76rem;
  padding: 4px 8px;
  border-radius: 4px;
  outline: none;
}

.search-input {
  width: 140px;
}

.toggle-check {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.74rem;
  color: #94a3b8;
  cursor: pointer;
}

.tool-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #e2e8f0;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.tool-btn:hover {
  background: #334155;
}

.export-btn {
  color: #7dd3fc;
  border-color: #0369a1;
}

.clear-btn {
  color: #fca5a5;
  border-color: #7f1d1d;
}

.log-stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  font-size: 0.72rem;
  color: #94a3b8;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
}

.stats-pills {
  display: flex;
  gap: 8px;
}

.stat-pill {
  padding: 1px 6px;
  border-radius: 3px;
  font-weight: 700;
}

.stat-pill.warn {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}

.stat-pill.error {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.log-error-banner {
  padding: 5px 12px;
  background: rgba(239, 68, 68, 0.25);
  color: #fecaca;
  font-size: 0.76rem;
}

.log-list {
  flex: 1;
  overflow-y: auto;
  padding: 6px 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
}

.empty-hint {
  color: #64748b;
  text-align: center;
  padding: 24px;
}

.log-row {
  display: grid;
  grid-template-columns: 46px 84px 52px 74px 72px 1fr;
  gap: 8px;
  align-items: baseline;
  padding: 4px 6px;
  border-bottom: 1px solid rgba(30, 41, 59, 0.6);
  line-height: 1.4;
}

.log-row.warn {
  background: rgba(245, 158, 11, 0.06);
}

.log-row.error {
  background: rgba(239, 68, 68, 0.1);
}

.col-id {
  color: #64748b;
}

.col-time {
  color: #94a3b8;
}

.col-level {
  font-weight: 800;
  text-align: center;
  border-radius: 3px;
  padding: 0 4px;
  font-size: 0.68rem;
}

.col-level.info {
  background: rgba(56, 189, 248, 0.18);
  color: #38bdf8;
}

.col-level.warn {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.col-level.error {
  background: rgba(239, 68, 68, 0.25);
  color: #f87171;
}

.col-cat {
  color: #a5b4fc;
  font-weight: 600;
}

.col-src {
  color: #34d399;
}

.col-msg {
  color: #f8fafc;
  word-break: break-word;
}
</style>
