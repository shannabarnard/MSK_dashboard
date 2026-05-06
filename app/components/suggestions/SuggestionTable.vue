<script setup lang="ts">
import type { Employee, Suggestion } from "../../types/suggestion";

defineProps<{
  items: Suggestion[];
  employeesById: Record<string, Employee>;
}>();
</script>

<template>
  <section
    class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse">
        <thead class="bg-slate-50 text-left">
          <tr>
            <th
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Employee
            </th>
            <th
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Type
            </th>
            <th
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Suggestion
            </th>
            <th
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Priority
            </th>
            <th
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Status
            </th>
            <th
              class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-t border-slate-100"
          >
            <td class="px-4 py-3 text-sm text-slate-800">
              {{ employeesById[item.employeeId]?.name ?? "Unknown" }}
            </td>
            <td class="px-4 py-3 text-sm text-slate-700 capitalize">
              {{ item.type }}
            </td>
            <td class="px-4 py-3 text-sm text-slate-700">
              {{ item.description }}
            </td>
            <td class="px-4 py-3 text-sm text-slate-700 capitalize">
              {{ item.priority }}
            </td>
            <td class="px-4 py-3 text-sm text-slate-700">{{ item.status }}</td>
            <td class="px-4 py-3 text-sm text-slate-700">
              <button
                class="rounded border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-50"
              >
                Update
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
