"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  discoveryStateKey,
  parseDiscoveryParams,
  writeDiscoveryParams,
  type ProjectDiscoveryState,
  type ProjectSort,
} from "@/lib/projects/discovery";
import type { ProjectCategory } from "@/types/project";

const SEARCH_URL_DELAY_MS = 300;

type HistoryMode = "push" | "replace";

/**
 * Discovery state mirrored in the URL.
 *
 * Results follow local state, so typing filters at once. Search text reaches
 * the URL with `replaceState` after a pause, so typing does not add history
 * entries. Category, sort, and clearing push an entry, so back and forward
 * step through them. A URL change this hook did not write, such as
 * back/forward or a link to `/`, replaces the local state.
 */
export function useDiscoveryState() {
  const searchParams = useSearchParams();
  const urlState = useMemo(
    () => parseDiscoveryParams(searchParams),
    [searchParams],
  );
  const urlKey = discoveryStateKey(urlState);

  const [state, setState] = useState(urlState);
  const [observedUrlKey, setObservedUrlKey] = useState(urlKey);
  const [writtenKey, setWrittenKey] = useState(urlKey);
  const stateKey = discoveryStateKey(state);

  if (urlKey !== observedUrlKey) {
    setObservedUrlKey(urlKey);
    if (urlKey !== writtenKey) {
      setWrittenKey(urlKey);
      if (urlKey !== stateKey) {
        setState(urlState);
      }
    }
  }

  useEffect(() => {
    if (stateKey === writtenKey) {
      return;
    }

    const timer = window.setTimeout(() => {
      setWrittenKey(writeHistory(state, "replace"));
    }, SEARCH_URL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [state, stateKey, writtenKey]);

  function commit(next: ProjectDiscoveryState) {
    setState(next);
    setWrittenKey(writeHistory(next, "push"));
  }

  return {
    state,
    setSearch: (search: string) =>
      setState((current) => ({ ...current, search })),
    setCategory: (category: ProjectCategory | null) =>
      commit({ ...state, category }),
    setSort: (sort: ProjectSort) => commit({ ...state, sort }),
    clearFilters: () => commit({ ...state, search: "", category: null }),
  };
}

/** Writes the state onto the current URL and returns its key. */
function writeHistory(state: ProjectDiscoveryState, mode: HistoryMode): string {
  const { pathname, search, hash } = window.location;
  const query = writeDiscoveryParams(
    new URLSearchParams(search),
    state,
  ).toString();
  const url = `${pathname}${query ? `?${query}` : ""}${hash}`;

  if (url !== `${pathname}${search}${hash}`) {
    if (mode === "push") {
      window.history.pushState(null, "", url);
    } else {
      window.history.replaceState(null, "", url);
    }
  }

  return discoveryStateKey(state);
}
