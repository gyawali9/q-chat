import React from "react";

export function formatMessageTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// utils/lazyWithDelay.ts

export const lazyWithDelay = (
  importFunc: () => Promise<{ default: React.ComponentType<unknown> }>,
  delay: number = 1000
) => {
  return React.lazy(
    () =>
      new Promise<{ default: React.ComponentType<unknown> }>((resolve) => {
        setTimeout(() => {
          importFunc().then(resolve);
        }, delay);
      })
  );
};
