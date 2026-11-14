import { useState, useCallback } from "react";

/**
 * Custom hook that manages an editable list (states, alphabets, transitions).
 * @param {Array} initial - Initial list value
 */
export function useList(initial = []) {
  const [list, setList] = useState(initial);

  const add = useCallback((item) => {
    setList((prev) => {
      if (prev.includes(item)) return prev;
      return [...prev, item];
    });
  }, []);

  const remove = useCallback((item) => {
    setList((prev) => prev.filter((x) => x !== item));
  }, []);

  const replace = useCallback((oldItem, newItem) => {
    setList((prev) => prev.map((x) => (x === oldItem ? newItem : x)));
  }, []);

  const reset = useCallback((newList) => {
    setList(newList);
  }, []);

  return { list, add, remove, replace, reset, setList };
}
