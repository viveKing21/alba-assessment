import { Suspense } from "react";
import { Reeltime } from "./reeltime";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Reeltime />
    </Suspense>
  );
}
