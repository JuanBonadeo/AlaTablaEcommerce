"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

declare global {
  interface Window {
    __clarityInitialized?: boolean;
  }
}

const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export default function ClarityProvider() {
  useEffect(() => {
    if (!projectId || window.__clarityInitialized) {
      return;
    }

    Clarity.init(projectId);
    window.__clarityInitialized = true;
  }, []);

  return null;
}