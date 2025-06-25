'use client';
// ^ Make sure to have 'use client'; because `setBasePath()` requires access to `document`.

import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js"
import dynamic from "next/dynamic";

export default function ShoelaceSetup({
  children,
}: {
  children: React.ReactNode
}) {
  setBasePath(`/shoelace-assets/`);
  return <>{children}</>
}

export const SlIcon = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/icon/index.js"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export const SlDialog = dynamic(
  () => import("@shoelace-style/shoelace/dist/react/dialog/index.js"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);