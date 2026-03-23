import type { Filters, ViewType, SortField, SortDirection } from "../types";

export function filtersToQueryParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.status.length > 0) {
    params.set("status", filters.status.join(","));
  }

  if (filters.priority.length > 0) {
    params.set("priority", filters.priority.join(","));
  }

  if (filters.assignee.length > 0) {
    params.set("assignee", filters.assignee.join(","));
  }

  if (filters.dateRange.start) {
    params.set("dateStart", filters.dateRange.start.toISOString());
  }

  if (filters.dateRange.end) {
    params.set("dateEnd", filters.dateRange.end.toISOString());
  }

  return params;
}

export function queryParamsToFilters(
  params: URLSearchParams,
): Partial<Filters> {
  const filters: Partial<Filters> = {};

  const status = params.get("status");
  if (status) {
    filters.status = status.split(",") as Filters["status"];
  }

  const priority = params.get("priority");
  if (priority) {
    filters.priority = priority.split(",") as Filters["priority"];
  }

  const assignee = params.get("assignee");
  if (assignee) {
    filters.assignee = assignee.split(",");
  }

  const dateStart = params.get("dateStart");
  const dateEnd = params.get("dateEnd");
  if (dateStart || dateEnd) {
    filters.dateRange = {
      start: dateStart ? new Date(dateStart) : null,
      end: dateEnd ? new Date(dateEnd) : null,
    };
  }

  return filters;
}

export function syncFiltersToURL(
  filters: Filters,
  view: ViewType,
  sortField: SortField,
  sortDirection: SortDirection,
): void {
  const params = filtersToQueryParams(filters);
  params.set("view", view);

  if (sortField) {
    params.set("sort", sortField);
    params.set("sortDir", sortDirection);
  }

  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newURL);
}

export function getInitialStateFromURL(): {
  filters: Partial<Filters>;
  view: ViewType;
  sortField: SortField;
  sortDirection: SortDirection;
} {
  const params = new URLSearchParams(window.location.search);

  return {
    filters: queryParamsToFilters(params),
    view: (params.get("view") as ViewType) || "kanban",
    sortField: (params.get("sort") as SortField) || null,
    sortDirection: (params.get("sortDir") as SortDirection) || "asc",
  };
}
